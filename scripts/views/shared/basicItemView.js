define(['app', 'marionette', 'underscore'], function (app, Marionette, _) {

    var ItemView = Marionette.ItemView.extend({        
        ui: {            
            txtError: '.txtError',
        },        

        requireValidation: function (error, input, errorLabel) {
            var value = input.val();
            if (value.length == 0) {
                this.showError(error, input, errorLabel);
                return false;
            }
            else {
                this.hideError(input, errorLabel);
                return true;
            }
        },

        showError: function (error, input, errorLabel) {
            if (input) {
                input.addClass('hasError');
            }

            if (errorLabel) {
                if (errorLabel == 'main') {
                    this.ui.txtError.text(error).show();
                } else {
                    errorLabel.text(error).show();
                }
            }
        },

        hideError: function (input, errorLabel) {
            if (input) {
                input.removeClass('hasError');
            }

            if (errorLabel) {
                errorLabel.hide();
            } else {
                this.ui.txtError.hide();
            }
        },
    });

    return ItemView;
});