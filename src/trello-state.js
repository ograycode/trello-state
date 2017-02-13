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
  cycleTime(card, startingLists, endingLists) {
    let start, end;
    startingLists.forEach((list) => {
      const last = this.findLast(card, list);
      if ((!start && last) || (last > start)) {
        start = last;
      }
    });
    
    endingLists.forEach((list) => {
      const earliest = this.findEarliest(card, list);
      if ((!end && earliest) || (earliest < end)) {
        end = earliest;
      }
    });
    
    if (!start || !end) {
      return -1;
    }
    return Math.abs(start.getTime() - end.getTime());
  },
  findEarliest(card, listId) {
    let earliest;
    let isListBefore = false;
    card.actions.forEach((action) => {
      const date = new Date(Date.parse(action.date));
      if (action.type === 'createCard' && isListBefore) {
        isListBefore = false;
        earliest = date;
      } else if (action.type === 'updateCard') {
        if (action.data.listBefore && action.data.listBefore.id === listId) {
          //need to find the next action that changed it, or created event.
          isListBefore = true;
        } else if (action.data.listAfter && action.data.listAfter.id === listId) {
          if (!earliest || earliest > date) {
            earliest = date;
          }
        }
      }
    });
    return earliest;
  },
  findLast(card, listId) {
    let last;
    let isListBefore = false;
    card.actions.forEach((action) => {
      const date = new Date(Date.parse(action.date));
      if (action.type === 'createCard' && isListBefore) {
        isListBefore = false;
        if (!last || last < date) {
          last = date;
        }
      } else if (action.type === 'updateCard') {
        if (action.data.listAfter && action.data.listAfter.id === listId) {
          if (!last || last < date) {
            last = date;
          }
          isListBefore = false;
        } else if (action.data.listBefore.id === listId) {
          // need to find either the last after event or created event.
          isListBefore = true;
        }
      }
    });
    return last;
  }
};