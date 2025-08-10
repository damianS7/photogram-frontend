export interface Follow {
  id: number;
  followedCustomerId: number;
  followedCustomerUsername: string;
  followedCustomerProfileImageFilename: string;
  followerCustomerId: number;
  followerCustomerUsername: string;
  followerCustomerProfileImageFilename: string;
}
