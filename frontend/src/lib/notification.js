export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export const showNotification = (title, body, icon = "/avatar.png") => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (document.visibilityState === "visible") return; // only show when tab is not active

  const notification = new Notification(title, {
    body,
    icon,
    badge: "/avatar.png",
    tag: title, // prevents duplicate notifications from same user
    renotify: true,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};
