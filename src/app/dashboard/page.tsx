"use client";
import Script from "next/script";
import React, { useState } from "react";
const userEmail = "aaryansh@techype.in";

const Page = () => {
  const [isSubscribed, setIsSubscribed] = useState(false); // Track subscription state

  const handleSubscribe = async () => {
    if (!isSubscribed) {
      // Replace with your actual subscription logic (API call, form submission, etc.)
      const response = await fetch(
        "http://localhost:1337/plugins/strapi-stripe/static/stripe.js",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      if (response.ok) {
        setIsSubscribed(true);
        console.log("Subscription successful!");
      } else {
        console.error("Subscription failed:", response.statusText);
      }
    }
  };
  return (
    <div>
      <Script
        type="text/javascript"
        src="http://localhost:1337/plugins/strapi-stripe/static/stripe.js"
        defer
      />
      Page
      <button
        className="css style SS_ProductCheckout"
        type="button"
        id={"SS_ProductCheckout"}
        data-id="1"
        data-email={userEmail}
        data-url="http://localhost:1337"
        onClick={()=>{
          console.log("clicked")
        }}
      >
        {" "}
        Subscribe{" "}
      </button>
    </div>
  );
};

export default Page;
