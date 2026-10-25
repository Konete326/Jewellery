export function getStoreStatus(customDate = null) {
  const now = customDate || new Date();
  const karachiTimeStr = now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
  const karachiDate = new Date(karachiTimeStr);
  const day = karachiDate.getDay();
  const minutes = karachiDate.getHours() * 60 + karachiDate.getMinutes();

  if (day === 0) {
    return {
      isOpen: false,
      badgeText: 'Closed Today',
      detailText: 'Opens Mon 1:00 PM',
      scheduleText: 'Closed on Sunday'
    };
  }

  if (day >= 1 && day <= 4) {
    const openMin = 780;
    const closeMin = 1230;
    if (minutes >= openMin && minutes < closeMin) {
      return {
        isOpen: true,
        badgeText: 'Open Now',
        detailText: 'Closes at 8:30 PM',
        scheduleText: 'Open Today until 8:30 PM'
      };
    }
    if (minutes < openMin) {
      return {
        isOpen: false,
        badgeText: 'Closed Now',
        detailText: 'Opens today at 1:00 PM',
        scheduleText: 'Opens today at 1:00 PM'
      };
    }
    const nextDayStr = day === 4 ? 'Fri at 3:30 PM' : 'Tomorrow at 1:00 PM';
    return {
      isOpen: false,
      badgeText: 'Closed Now',
      detailText: `Opens ${nextDayStr}`,
      scheduleText: `Opens ${nextDayStr}`
    };
  }

  if (day === 5) {
    const openMin = 930;
    const closeMin = 1290;
    if (minutes >= openMin && minutes < closeMin) {
      return {
        isOpen: true,
        badgeText: 'Open Now',
        detailText: 'Closes at 9:30 PM',
        scheduleText: 'Open Today until 9:30 PM'
      };
    }
    if (minutes < openMin) {
      return {
        isOpen: false,
        badgeText: 'Closed Now',
        detailText: 'Opens today at 3:30 PM',
        scheduleText: 'Opens today at 3:30 PM (Friday)'
      };
    }
    return {
      isOpen: false,
      badgeText: 'Closed Now',
      detailText: 'Opens Sat at 1:30 PM',
      scheduleText: 'Opens Saturday at 1:30 PM'
    };
  }

  if (day === 6) {
    const openMin = 810;
    const closeMin = 1230;
    if (minutes >= openMin && minutes < closeMin) {
      return {
        isOpen: true,
        badgeText: 'Open Now',
        detailText: 'Closes at 8:30 PM',
        scheduleText: 'Open Today until 8:30 PM'
      };
    }
    if (minutes < openMin) {
      return {
        isOpen: false,
        badgeText: 'Closed Now',
        detailText: 'Opens today at 1:30 PM',
        scheduleText: 'Opens today at 1:30 PM'
      };
    }
    return {
      isOpen: false,
      badgeText: 'Closed Now',
      detailText: 'Opens Mon at 1:00 PM',
      scheduleText: 'Closed Sunday • Opens Monday'
    };
  }

  return {
    isOpen: false,
    badgeText: 'Closed',
    detailText: 'Saddar, Karachi',
    scheduleText: 'Boutique Hours'
  };
}
