
export default {
  
  messageToUser: (vm, options) => {
    
    let messageText = '';
    if (options.message) {
      messageText = options.message;
    }

    let messageTitle = '';
    if (options.title) {
      messageTitle = options.title;
    }

    vm.$bvToast.toast(messageText, {
      title: messageTitle,
      autoHideDelay: options.autoHideDelay ? options.autoHideDelay : 2000,
      variant: options.variant ? options.variant : 'primary',
      appendToast: options.appendToast ? options.appendToast : true 
    });

  },

}

