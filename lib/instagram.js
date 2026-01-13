
import axios from 'axios';


/**
 * Exchange Instagram auth code for long-lived access token
 */
export async function getInstagramLongLivedToken(authCode) {
  try {
    // ----------------------------------
    // STEP 1: auth code -> short-lived token
    // ----------------------------------
    const params = new URLSearchParams();
    params.append("client_id", process.env.INSTAGRAM_APP_ID);
    params.append("client_secret", process.env.INSTAGRAM_APP_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", process.env.INSTAGRAM_REDIRECT_URI);
    params.append("code", authCode);
    console.log({
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code: authCode
    })
    const shortTokenResponse = await axios.post(
      'https://api.instagram.com/oauth/access_token', params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log(shortTokenResponse.data);

    const shortTokenData = shortTokenResponse.data;

    const shortLivedToken = shortTokenData.access_token;
    const instagramLoginId = shortTokenData.user_id;

    // // ----------------------------------
    // // STEP 2: short-lived -> long-lived token
    // // ----------------------------------

    const longTokenResponse = await axios.get(
      'https://graph.instagram.com/access_token',
      {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          access_token: shortLivedToken
        }
      }
    );
    console.log(longTokenResponse.data);

    return {
      instagramLoginId: instagramLoginId,
      accessToken: longTokenResponse.data.access_token,
      expiresIn: longTokenResponse.data.expires_in
    };

  } catch (error) {
    if (error.response) {
      throw new Error(
        `Instagram OAuth error: ${JSON.stringify(error.response.data)}`
      );
    }
    throw error;
  }
}

export async function getInstagramAccountDetails(accessToken) {
  if (!accessToken) {
    throw new Error("Access token is required");
  }

  const url = "https://graph.instagram.com/v24.0/me";

  try {
    const response = await axios.get(url, {
      params: {
        fields: "user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count",
        access_token: accessToken
      }
    });

    const data = response.data; //basic profile details


    //getting the media objects too(posts)
    const instagramAccountId = data.user_id;
    const posts = await getInstagramUserPosts({ instagramAccountId, accessToken });
    return {
      instagramAccountId: data.user_id,
      username: data.username,
      name: data.name,
      account_type: data.account_type,
      profile_picture_url: data.profile_picture_url,
      followers_count: data.followers_count,
      follows_count: data.follows_count,
      media_count: data.media_count,
      posts: posts
    };
  } catch (error) {
    if (error.response) {
      console.error(
        "Instagram API error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("Request failed:", error.message);
    }

    throw new Error("Could not retrieve Instagram account info");
  }
}
export async function getInstagramUserPosts({ instagramAccountId, accessToken }) {
  if (!accessToken || !instagramAccountId) {
    throw new Error("Access token and instagramAccId is required");
  }
  try {
    //get the all media objects
    const URL = `https://graph.instagram.com/v24.0/${instagramAccountId}/media`;
    const res = await axios.get(URL, {
      params: {
        fields: "id,media_type,media_url,permalink,thumbnail_url,like_count,caption,comments_count",
        access_token: accessToken
      }
    });
    const posts = res.data.data;
    return posts;
  } catch (error) {
    throw new Error("Could not retrieve Instagram account info");
  }
}

export async function sendReplyMessage({ reply_message, comment_id, accessToken }) {
  const url = `https://graph.instagram.com/v24.0/${comment_id}/replies`;


  const response = await axios.post(url,
    {
      message: reply_message,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("replied comment succesfully");
    console.log(response.data.id)
}

export async function sendDmMessage({ dm_message, instagramAccountId, comment_id, accessToken }) {
  const url = `https://graph.instagram.com/v24.0/${instagramAccountId}/messages`;
  const response = await axios.post(
    url,
    {
      recipient: {
        comment_id: comment_id,
      },
      message: {
        text: dm_message,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("DM sent successfully");
  console.log("message_id:"+ response.data.message_id);
}