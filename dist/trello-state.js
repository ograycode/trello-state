(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["trelloState"] = factory();
	else
		root["trelloState"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  on: function on(cards, time) {
	    var state = [];
	    cards.forEach(function (card) {
	      var clone = JSON.parse(JSON.stringify(card));
	      clone.actions.forEach(function (action) {
	        if (time < new Date(Date.parse(action.date)) && action.data.old) {
	          for (var key in action.data.old) {
	            clone[key] = action.data.old[key];
	          }
	        }
	      });
	      clone.actions = clone.actions.filter(function (action) {
	        return time > new Date(Date.parse(action.date));
	      });
	      if (clone.actions.length > 0) {
	        state.push(clone);
	      }
	    });
	    return state;
	  },
	  cycleTime: function cycleTime(card, startingLists, endingLists) {
	    var _this = this;
	
	    var start = void 0,
	        end = void 0;
	    startingLists.forEach(function (list) {
	      var last = _this.findLast(card, list);
	      if (!start && last || last > start) {
	        start = last;
	      }
	    });
	
	    endingLists.forEach(function (list) {
	      var earliest = _this.findEarliest(card, list);
	      if (!end && earliest || earliest < end) {
	        end = earliest;
	      }
	    });
	
	    if (!start || !end) {
	      return -1;
	    }
	    return Math.abs(start.getTime() - end.getTime());
	  },
	  findEarliest: function findEarliest(card, listId) {
	    var earliest = void 0;
	    var isListBefore = false;
	    card.actions.forEach(function (action) {
	      var date = new Date(Date.parse(action.date));
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
	  findLast: function findLast(card, listId) {
	    var last = void 0;
	    var isListBefore = false;
	    card.actions.forEach(function (action) {
	      var date = new Date(Date.parse(action.date));
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=trello-state.js.map