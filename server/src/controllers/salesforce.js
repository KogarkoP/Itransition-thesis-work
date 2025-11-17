import axios from "axios";

const {
  SF_USERNAME,
  SF_PASSWORD,
  SF_SECURITY_TOKEN,
  SF_CLIENT_ID,
  SF_CLIENT_SECRET,
} = process.env;

const GET_ACCESS_TOKEN = async () => {
  const url = "https://login.salesforce.com/services/oauth2/token";

  const params = new URLSearchParams({
    grant_type: "password",
    client_id: SF_CLIENT_ID,
    client_secret: SF_CLIENT_SECRET,
    username: SF_USERNAME,
    password: SF_PASSWORD + SF_SECURITY_TOKEN,
  });

  const response = await axios.post(url, params);
  return response.data;
};

const CREATE_ACCOUNT = async (accessToken, instanceUrl, user) => {
  const response = await axios.post(
    `${instanceUrl}/services/data/v60.0/sobjects/Account`,
    {
      Name: user.companyName || `${user.firstName} ${user.lastName}`,
      Phone: user.phone || null,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response.data.id;
};

const CREATE_CONTACT = async (accessToken, instanceUrl, user, accountId) => {
  const response = await axios.post(
    `${instanceUrl}/services/data/v60.0/sobjects/Contact`,
    {
      FirstName: user.firstName,
      LastName: user.lastName,
      Email: user.email,
      AccountId: accountId,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response.data.id;
};

export const SYNC_USER_TO_SALESFORCE = async (req, res) => {
  try {
    const user = req.body;

    const { access_token, instance_url } = await GET_ACCESS_TOKEN();

    const accountId = await CREATE_ACCOUNT(access_token, instance_url, user);
    const contactId = await CREATE_CONTACT(
      access_token,
      instance_url,
      user,
      accountId
    );

    res.json({
      success: true,
      accountId,
      contactId,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};
