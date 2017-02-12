export default {
  on (cards, time) {
    const state = [];
    cards.forEach(card => {
      const clone = JSON.parse(JSON.stringify(card));
      clone.actions.forEach(action => {
        if (time < new Date(Date.parse(action.date)) && action.data.old) {
          for (const key in action.data.old) {
            clone[key] = action.data.old[key];
          }
        }
      });
      clone.actions = clone.actions.filter(action => {
        return time > new Date(Date.parse(action.date))
      });
      if (clone.actions.length > 0) {
        state.push(clone);
      }
    });
    return state;
  },
};