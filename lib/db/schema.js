import { threadCpuUsage } from "process";
import clientPromise from "./mongo.js";

export async function getDb() {
  const client = await clientPromise;
  return client.db("insta_project");
}
export async function saveInstagramToken({
  instagramLoginId: instagramLoginId,
  instagramAccountId: instagramAccountId,
  username: username,
  accessToken: accessToken,
  name: name,
  account_type: account_type,
  profile_picture_url: profile_picture_url,
  followers_count: followers_count,
  follows_count: follows_count,
  media_count: media_count,
  posts: posts,
  expiresAt: expiresAt
}) {
  console.log(instagramLoginId);
  console.log(instagramAccountId);
  console.log(accessToken);
  console.log(name);
  console.log(profile_picture_url);
  console.log(followers_count);
  console.log(follows_count);
  console.log(media_count);
  console.log(expiresAt);
  console.log("printed all");
  if (!instagramLoginId || !instagramAccountId || !username || !accessToken || !expiresAt) {
    throw new Error("Missing required fields to save Instagram token");
  }

  const db = await getDb();
  const collection = db.collection("instagram_accounts");

  await collection.updateOne(
    { instagram_login_id: String(instagramLoginId), instagram_account_id: instagramAccountId },
    {
      $set: {
        username: username,
        access_token: accessToken,
        name: name,
        account_type: account_type,
        profile_picture_url: profile_picture_url,
        followers_count: followers_count,
        follows_count: follows_count,
        media_count: media_count,
        expires_at: expiresAt,
        posts: posts,
        updated_at: new Date()
      },
      $setOnInsert: {
        created_at: new Date()
      }
    },
    { upsert: true }
  );
}


export async function getProfileDetails(instagram_account_id) {
  console.log("got into getinstatoken")

  if (!instagram_account_id) {
    console.log("userid not found")
    throw new Error("User ID is required");
  }
  try {
    console.log("tried db call ")


    const db = await getDb();
    const account_collection = db.collection("instagram_accounts");
    //getting the User details basic details  from our db
    const UserData = await account_collection.findOne({
      instagram_account_id: instagram_account_id
    });

    if (!UserData) {
      throw new Error("Instagram token not found");
    }
    //getting the User automations details from our db
    const automation_collection = db.collection("automations")
    const UserAutomations = await automation_collection.find({
       instagram_account_id: instagram_account_id },
      { projection: { _id: 0 } }
    ).toArray();
      
    UserData.automations = UserAutomations;
    console.log(UserData);
    return UserData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get User Profile Details");
  }
}

export async function updatePosts({ instagramAccountId, lastestPosts }) {
  try {


    const db = await getDb();
    const account_collection = db.collection("instagram_accounts");
    await account_collection.updateOne(
      { instagram_account_id: instagramAccountId },
      {
        $set: {
          posts: lastestPosts,
          updated_at: new Date()
        }
      }
    );
    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
}

// Automations collection operations

export async function saveAutomation({
  media_id: media_id,
  instagram_account_id: instagram_account_id,
  media_url: media_url,
  status: status,
  reply_message: reply_message,
  dm_message: dm_message,
  permalink: permalink,
}) {

  console.log("got into saveAutomation")
  if (!media_id || !instagram_account_id) {
    throw new Error("media id or insta id is missing");
  }
  if (!reply_message && !dm_message) {
    throw new Error("atleast one response type is required! reply or dm message");
  }
  try {


    const db = await getDb();
    const collection = db.collection("automations");
    await collection.updateOne(
      { media_id: media_id },
      {
        $set: {
          instagram_account_id: instagram_account_id,
          media_url: media_url,
          status: status,
          dm_message: dm_message,
          reply_message: reply_message,
          permalink: permalink,
          updated_at: new Date(),
        },
        $setOnInsert: {
          created_at: new Date(),
        },
      },
      { upsert: true }
    );
    return { success: true }
  }
  catch (e) {
    console.log(e);
    return { success: false }
  }


}


export async function deleteAutomation(media_id) {
  try {
    if (!media_id) {
      throw new Error("Media Id required")
    }
    const db = await getDb();
    const collection = db.collection("automations");
    await collection.deleteOne({ media_id: media_id });

    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
}
export async function findAutomation(media_id) {
  try {
    if (!media_id) {
      throw new Error("Media Id required")
    }
    const db = await getDb();
    const collection = db.collection("automations");
    const mediaData = await collection.findOne({ media_id: media_id });
    if (!mediaData){
      throw new Error("no media found");
    }
    return { reply_message: mediaData.reply_message, dm_message: mediaData.dm_message, status: mediaData.status};
  } catch (e) {
    console.log(e);
    return { reply_message:"", dm_message: "", status:false};
  }
}

export async function toggleAutomation({ media_id, status }) { //activate or deactivate the automation 
  try {
    if (!media_id) {
      throw new Error("Media Id required")
    }
    if (status !== "true" && status !== "false") {
      throw new Error("Invalid status");
    }
    const db = await getDb();
    const collection = db.collection("automations");

    await collection.updateOne(  // update the status of automation
      { media_id: media_id },
      {
        $set: {
          status: status=="true" ? true : false,
          updated_at: new Date(),
        },
      }
    );

    return { success: "true" };
  } catch (e) {
    console.log(e);
    return { success: "false" };
  }
}



