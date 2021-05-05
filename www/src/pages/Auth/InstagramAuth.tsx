import React, { useEffect, useContext } from "react";

export default () => {
  useEffect(() => {
    // get the URL parameters which will include the auth token
    const params = window.location.search;
    if (params) {
      localStorage.setItem("instagramCode", JSON.stringify({ params }));
    }
    // close the popup
    window.close();
  }, [window.location.search]);
  // some text to show the user
  return <p>Please wait...</p>;
};
