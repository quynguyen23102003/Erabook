## `Genre` model

```ts
{
    _id: string;
    name: string;
    description: string;
    coverImage?: string; // server generated, pick cover image from a random book with said genre, else return undefined
}
```

## `GET` **/genres/:id/details**

### Get a genre details

The `:id` is a required param - representing the **ID of a genre**, passed as part of the URL path.

<details>
<summary>Return</summary>

```ts
{
    ...model
}
```

</details>

## `GET` **/genres/getAll[?search=\<name\>]**

### Get all available genres

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>
