import axiosClient from "../axiosClient";

export const getAllSubscriptionPlans = () => {
  return axiosClient.get("/subscriptions/plans");
};

export const getCurrentSubscription = () => {
  return axiosClient.get("/subscriptions/current");
};

export const subscribePlan = (planId) => {
  return axiosClient.post(
    "/subscriptions/subscribe",
    { planId }
  );
};