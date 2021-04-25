import {
  auth,
  googleProvider,
  facebookProvider,
  appleProvider,
} from "../firebase";

const providers = {
  google: googleProvider,
  facebook: facebookProvider,
  apple: appleProvider,
};

export const handleGoogleAuth = (
  success: Function,
  fail: Function,
  email?: string
) => handleProviderAuth("google", success, fail, email);

export const handleFacebookAuth = (success: Function, fail: Function) =>
  handleProviderAuth("facebook", success, fail);

export const handleAppleAuth = (success: Function, fail: Function) =>
  handleProviderAuth("apple", success, fail);

const handleProviderAuth = async (
  provider: string,
  success: Function,
  fail: Function,
  email?: string
) => {
  try {
    const authUser = await auth.signInWithPopup(providers[provider]);
    if (!authUser.user) throw Error("Failed to authenticate");
    if (email && email.toLowerCase() !== authUser.user.email?.toLowerCase())
      throw Error(`Used account is not ${email}`);
    const result = await authUser.user.getIdTokenResult();
    if (result.claims.roles && result.claims.roles.length !== 0) {
      success(authUser, result.claims.roles);
    } else {
      throw Error("This account does not have any roles");
    }
  } catch (error) {
    if (auth.currentUser) {
      auth.signOut();
    }
    fail(error);
  }
};

export const handleEmailAndPasswordAuth = async (
  success: Function,
  fail: Function,
  email: string,
  password: string
) => {
  try {
    const authUser = await auth.signInWithEmailAndPassword(email, password);
    if (!authUser.user) throw Error("Failed to authenticate");
    const result = await authUser.user.getIdTokenResult();
    if (result.claims.roles && result.claims.roles.length !== 0) {
      success(authUser, result.claims.roles);
    } else {
      throw Error("This account does not have any roles");
    }
  } catch (error) {
    if (auth.currentUser) {
      auth.signOut();
    }
    fail(error);
  }
};

export const signOut = () => {
  if (auth.currentUser) {
    auth.signOut();
  }
};
