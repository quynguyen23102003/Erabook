## Server URL: https://bookworm-server.fly.dev

### If anything goes wrong, spam ping me

## How to use the API

While making requests to the server, please pass the `Access token` obtained via `auth/login`,`auth/register` and `auth/renew` endpoints as `Bearer <token>` in the `Authorization` request header.

```ts
fetch("/api/endpoint", {
	headers: {
		Authorization: "Bearer <token>",
	},
});
```

### `New` Now support both JSON and FormData for request body

You can use either JSON or FormData for your request body. While most endpoints can be used with JSON body, some endpoints include file uploading hence you should use FormData body for those endpoints instead.

Some notes when uploading file attachments:

-   use `FormData` for your request body
-   put the `File` object in a field named `file`

```ts
fetch("/api/endpoint", {
    body: JSON.stringify({
        field_name: field_value,
        field_name: field_value,
        ...
    })
})
```

```ts
const formData = new FormData();
formData.append("<field_name>", "<field_value>"); // regular field value
formData.append("file", new File(...)); // file attachment, fixed field name "file"
...

fetch("/api/endpoint", {
    body: formData
})
```

## API response structure:

```ts
{
    status: number,
    message: string,
    pagination: {
        itemCount?: number,
        pageCount?: number,
        currentPage?: number,
        hasNext: boolean,
    },
    data?: any,
}
```

## Available APIs:

### User related - (client) Bearer token required

#### [Authentication](docs/API.Authentication.md) - Authentication, only `/auth/logout` requires Bearer token, others not needed

#### [Account/Base](docs/API.Account.md) - Base account endpoints, like account information and such

#### [Account/Billing](docs/API.Account.Billing.md) - Account billing endpoints, including payments, purchase [history] and such

#### [Authors](docs/API.Authors.md) - Author endpoints, fetch information of requested author

#### [Genres](docs/API.Genres.md) - Genre endpoints, fetch information of requested genre

#### [Books](docs/API.Books.md) - Book endpoints, books search, fetch information of requrested book, account related actions and page viewing

#### [Ratings](docs/API.Rating.md) - Rating endpoints, fetch/update/create ratings of the requested book entry

#### [Translation](docs/API.Translate.md) - Translation endpoints, for translate book pages

<hr>

### Admin related - (client) Bearer token + (server) admin role required

Pretty basic setup, to `create/update/remove` entries

#### [Admin/Accounts](docs/admin/API.Admin.Accounts.md) - Include user's activity log

#### [Admin/Authors](docs/admin/API.Admin.Authors.md)

#### [Admin/Books](docs/admin/API.Admin.Books.md)

#### [Admin/Ratings](docs/admin/API.Admin.Ratings.md)

#### [Admin/Genres](docs/admin/API.Admin.Genres.md)

#### [Admin/Statistics](docs/admin/API.Admin.Statistics.md)
