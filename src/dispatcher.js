//Want to pass actions through a dispatcher rather than to the model directly

const dispatcher = {
  listeners: [],
  actions: {},
  addListener(listener){
    this.listeners.push(listener);
    console.log(dispatcher);
  },
  addAction(listener, action){
    //console.log(action.trigger);
    listener.actions = listener.actions || {};
    listener.actions[action.name] = action.trigger;
    console.log(listener);
  },
  sendMessage(message){
    console.log("received message:", message);
    for(let i = 0; i < this.listeners.length; i++){
      let listener = this.listeners[i];
      //for(let action in listener.actions){
        if(listener.actions.hasOwnProperty(message.action)){
          //console.log(action);
          listener.actions[message.action](message.payload);
        }
      //}
    }
  }
};

// Not entirely sure if I'm happy with this implementation but I wanted to see
// what I could do without looking up any patterns. Seems to be working at the
// moment so let's see how it goes.
export default dispatcher;
