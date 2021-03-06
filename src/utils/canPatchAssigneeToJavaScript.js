import type { Node } from '../patchers/types';

/**
 * Determine if the given assignee (array destructure, object destructure, rest,
 * etc.) can be translated to JavaScript directly. If not, we'll need to expand
 * the assignee into repeated assignments.
 *
 * Notably, we cannot patch default values (assignment operations) to JavaScript
 * since CS falls back to the default if the value is undefined or null, while
 * JS falls back to the default if the value only if the value is undefined.
 */
export default function canPatchAssigneeToJavaScript(node: Node, isTopLevel: boolean = true): boolean {
  if ([
        'Identifier', 'MemberAccessOp', 'SoakedMemberAccessOp', 'ProtoMemberAccessOp',
        'DynamicMemberAccessOp', 'SoakedDynamicMemberAccessOp', 'SoakedProtoMemberAccessOp',
      ].indexOf(node.type) > -1) {
    return true;
  }
  if (node.type === 'ArrayInitialiser') {
    // Nested array destructures can't convert cleanly because we need to wrap
    // them in Array.from.
    if (!isTopLevel) {
      return false;
    }
    // Empty destructure operations need to result in zero assignments, and thus
    // not call Array.from at all.
    if (node.members.length === 0) {
      return false;
    }
    return node.members.every((member, i) => {
      let isFinalExpansion = (i === node.members.length - 1) &&
          ['Spread', 'Rest', 'Expansion'].indexOf(member.type) > -1;
      let isValidFinalExpansion = isFinalExpansion && (
        member.type === 'Expansion' || canPatchAssigneeToJavaScript(member.expression)
      );
      return isValidFinalExpansion || canPatchAssigneeToJavaScript(member, false);
    });
  }
  if (node.type === 'ObjectInitialiser') {
    // JS empty destructure crashes if the RHS is undefined or null, so more
    // precisely copy the behavior for empty destructures.
    if (node.members.length === 0) {
      return false;
    }
    return node.members.every(node => canPatchAssigneeToJavaScript(node, false));
  }
  if (node.type === 'ObjectInitialiserMember') {
    return canPatchAssigneeToJavaScript(node.expression, false);
  }
  return false;
}
