export async function spawnNotification(title, options = undefined) {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return null;
  } else if (Notification.permission === 'granted') {
    return new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    if (await Notification.requestPermission() === 'granted') {
      return new Notification(title, options);
    }
  }
}
