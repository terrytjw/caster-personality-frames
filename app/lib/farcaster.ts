import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";
const client = new NeynarAPIClient("NEYNAR_FROG_FM");

export const fetchUser = async (fid: number) => {
  return await client.lookupUserByFid(fid);
};
export const fetchAllFollowing = async (fid: number) => {
  let cursor: string | null = "";
  let users: unknown[] = [];
  do {
    const result = await client.fetchUserFollowing(fid, {
      limit: 150,
      cursor,
    });
    users = users.concat(result.result.users);
    cursor = result.result.next.cursor;
    console.log(cursor);
  } while (cursor !== "" && cursor !== null);

  return users;
};

export async function fetchFeedByFids(fids: number[]) {
  return await client.fetchFeed(FeedType.Filter, {
    filterType: FilterType.Fids,
    fids,
  });
}

export const fetchAndProcessFeeds = async (fid: number) => {
  //   const user = await fetchUser(fid);
  const followings = await fetchAllFollowing(fid);
  const followingFids = followings.map((user: any) => user.fid);
  const followingFeeds: any = await fetchFeedByFids(followingFids);
  const userFeeds: any = await fetchFeedByFids([fid]);

  const followingCasts =
    followingFeeds.casts.length > 0
      ? followingFeeds.casts.map((cast: any) => cast?.text)
      : [];
  const userCasts =
    userFeeds.casts.length > 0
      ? userFeeds.casts.map((cast: any) => cast?.text)
      : [];
  return { followingCasts, userCasts };
};
