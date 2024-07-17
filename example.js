{
  types: { // other inbuilt helper types are "FileString", "UrlString", "FileBase64", "UrlBase64", "Date", "Time", "DateTime", "Number", "Integer", "Boolean", "Enum"
    User: {
      label: "User";
      fields: {
        name: {
          type: 'String';
          required: true; // 'name' field is always displayed
          init: (ctx, valuePath) => {
            return {
              value: "Default Value",
              label: "Name",
              disabled: true // 'field cannot be edited
            }
          };
        };
        email: {
          type: 'String';
          required: true;
          init: (ctx, valuePath) => {
            return {
              value: "Default Email",
              label: "Email"
            }
          };
        };
        address: {
          type: 'Address';
          required: false; // can be added to the form by clicking (+) and removed by clicking (-) at the right edge of the field
          init: (ctx, valuePath) => {
            return {
              value: "Default Value",
              label: "Name",
              value: {
                street: {
                  value: "Default Street",
                  label: "Street"
                },
                city: {
                  value: "Default City",
                  label: "City"
                },
                state: {
                  value: "Default State",
                  label: "State"
                },
                zip: {
                  value: "Default Zip",
                  label: "Zip"
                }
              }
            }
          }
        }
      };
    };
    Address: {
      label: "Address";
      fields: {
        street: {
          type: 'NonEmptyString';
          required: true;
          init: (ctx, valuePath) => {
            return {
              value: "Default Street",
              label: "Street"
            }
          }
        };
        city: {
          type: 'NonEmptyString';
          required: true;
          init: (ctx, valuePath) => {
            return {
              value: "Default City",
              label: "City"
            }
          }
        };
        state: {
          type: 'NonEmptyString';
          required: true;
          init: (ctx, valuePath) => {
            return {
              value: "Default State",
              label: "State"
            }
          }
        };
        zip: {
          type: 'NonEmptyString';
          required: true;
          init: (ctx, valuePath) => {
            return {
              value: "Default Zip",
              label: "Zip",
              validate: (ctx, valuePath, value) => value.length === 6
            }
          }
        }
      }
    };
    NonEmptyString: {
      label: "non-empty string";
      fields: {
        value: {
          type: 'String';
          required: true;
          init: (ctx, valuePath) => {
            return {
              value: "Default Value",
              label: undefined,
              validate: (ctx, valuePath, value) => value.length > 0
            }
          }
        }
      }
    };
    BlogEntry: {
      label: "Blog Entry";
      fields: {
        items: {
          type: '[TextEntry, ImageEntry]';
          required: true;
          init: (ctx, valuePath) => {
            return {
              value: [],
              onChoice: (ctx, valuePath, choice) => { // onChoice is called when the user selects a type from the dropdown, this allows for custom behavior based on current document state
                return true; // return false to prevent the user from selecting the type
              }
            }
          }
        }
      }
    };
  };
  defaultEntryType: 'User'; // this can also be passed during runtime to specify the entry type dynamically
}