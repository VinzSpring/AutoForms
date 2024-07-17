
type InitResult = {
  value: any;
  label?: string;
  disabled?: boolean;
  validate?: (ctx: object, valuePath: string, value: any) => string | true;
  onChoice?: (ctx: object, valuePath: string, choice: string) => boolean;
  onChanged?: (ctx: object, valuePath: string, value: any, mutator: (valuePath: string, value: any) => void) => void; // this allows for dispatching changes to other fields, even in parent objects
};

type SchemaType<T> = {
  label: string;
  fields: {
    [K in keyof T]: {
      type: string;
      required: boolean;
      init: (ctx: any, valuePath: any) => InitResult;
    };
  };
};

type Schema = {
  types: {
    [key: string]: SchemaType<any>;
  };
  defaultEntryType: string;
};

// Example usage with the provided schema:
const schema: Schema = {
  types: {
    User: {
      label: "User",
      fields: {
        name: {
          type: 'String',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Value",
            label: "Name",
            disabled: true
          })
        },
        email: {
          type: 'String',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Email",
            label: "Email"
          })
        },
        address: {
          type: 'Address',
          required: false,
          init: (ctx, valuePath) => ({
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
          })
        }
      }
    },
    Address: {
      label: "Address",
      fields: {
        street: {
          type: 'NonEmptyString',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Street",
            label: "Street"
          })
        },
        city: {
          type: 'NonEmptyString',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default City",
            label: "City"
          })
        },
        state: {
          type: 'NonEmptyString',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default State",
            label: "State"
          })
        },
        zip: {
          type: 'NonEmptyString',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Zip",
            label: "Zip",
            validate: (ctx, valuePath, value) => value.length === 6 || "Zip code must be 6 characters long"
          })
        }
      }
    },
    NonEmptyString: {
      label: "non-empty string",
      fields: {
        value: {
          type: 'String',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Value",
            validate: (ctx, valuePath, value) => value.length > 0 || "Value must not be empty"
          })
        }
      }
    },
    BlogEntry: {
      label: "Blog Entry",
      fields: {
        items: {
          type: '[TextEntry, ImageEntry]',
          required: true,
          init: (ctx, valuePath) => ({
            value: [],
            onChoice: (ctx, valuePath, choice) => true
          })
        }
      }
    }
  },
  defaultEntryType: 'User'
};
