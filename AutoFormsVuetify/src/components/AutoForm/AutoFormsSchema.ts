
export type InitResult<T> = {
  value: T;
  label?: string;
  disabled?: boolean;
  validate?: (ctx: object, valuePath: string, value: any) => string | true;
  onChoice?: (ctx: object, valuePath: string, choice: string) => boolean;
  onChanged?: (ctx: object, valuePath: string, value: any, mutator: (valuePath: string, value: any) => void) => void; // this allows for dispatching changes to other fields, even in parent objects
};

export type SchemaField = {
  type: string;
  isArray?: boolean;
  required: boolean;
  init: (ctx: any, valuePath: string) => InitResult<any>;
};

export type SchemaType<T> = {
  label: string;
  fields: {
    [K in keyof T]: SchemaField;
  };
};

export type Schema = {
  types: {
    [key: string]: SchemaType<any>;
  };
  defaultEntryType: string;
};

// Example usage with the provided schema:
export const testSchema: Schema = {
  types: {
    User: {
      label: "User",
      fields: {
        name: {
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Value",
            label: "Name",
            disabled: true
          })
        },
        email: {
          type: 'string',
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
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Street",
            label: "Street"
          })
        },
        city: {
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default City",
            label: "City"
          })
        },
        state: {
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default State",
            label: "State"
          })
        },
        zip: {
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "01067",
            label: "Zip",
            validate: (ctx, valuePath, value) => value.length === 5 || "Zip code must be 5 characters long"
          })
        }
      }
    },
    NonEmptyString: {
      label: "non-empty string",
      fields: {
        value: {
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Value",
            validate: (ctx, valuePath, value) => value.length > 0 || "Value must not be empty"
          })
        }
      }
    },
    TextEntry: {
      label: "Text Entry",
      fields: {
        text: {
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Text",
            label: "Text"
          })
        }
      }
    },
    ImageEntry: {
      label: "Image Entry",
      fields: {
        url: {
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default URL",
            label: "URL"
          })
        }
      }
    },
    BlogEntry: {
      label: "Blog Entry",
      fields: {
        title: {
          type: 'string',
          required: true,
          init: (ctx, valuePath) => ({
            value: "Default Title",
            label: "Title"
          })
        },
        items: {
          type: 'TextEntry|ImageEntry',
          isArray: true,
          required: true,
          init: (ctx, valuePath) => ({
            value: [],
            onChoice: (ctx, valuePath, choice) => true
          })
        }
      }
    }
  },
  defaultEntryType: 'BlogEntry'
};
