# Admin UI

The user interface for admins to manage resources such as device, users,
hierarchies.

# Devices

# Users

# Roles

# Hierarchies

The hierarchy as the name suggests relates to the how the structure is arranged.
For example the company name could be at the root of hierarchy, group of rooms
could be branches to it and individual rooms could be leafs of hierarchies.

The hierarchy design is used for assigning permissions to users so that the user
gets to access only the hierarchy and its children.

A hierarchy could be added as child hierarchy of an hierarchy. A hierarchy might
also be removed but not if it has child hierarchies. The hierarchy could also be
given a different name and through the edit modal there is an option of giving
users access to the hierarchy.

On the technical side, if the user adds/removes or edits an hierarchy the
changes are made to the database and Auth0. User management could be used for
revoking a permission from a user.

## Configuration

Following environment variables are supported:

```
  NODE_ENV: <Node environment (development or production)>
  BASE_API_URL: <URL endpoint for db api>
  AUTH0_DOMAIN: <URL endpoint of Auth0 domain>
  AUTH0_CLIENT_ID: <Client ID for Auth0>
  AUTH0_AUDIENCE: <API identifier in Auth0>
  AUTH0_TENANT: <'tenant:UUID' of the root hierarchy>
  AUTH0_RESOURCE_SERVER_ID: <ID of the desired Resource Server in Auth0>
```
