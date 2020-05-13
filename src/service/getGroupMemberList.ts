import getTIM from '@/TIMSDK';

interface GetGroupMemberListParams {
  groupID: string;
  count: number;
  offset: number;
}

const getGroupMemberList = (params: GetGroupMemberListParams) =>
  getTIM().then((tim) => tim.getGroupMemberList(params));

export default getGroupMemberList;
