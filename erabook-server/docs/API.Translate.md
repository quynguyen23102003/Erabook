## `GET` **/translate/langCodes**

### Get all translatable languages. Note: Does not require Bearer token

<details>
<summary>Return</summary>

```ts
{
    all: { // all available languages
        "<lang_code>": "<lang_readable_name>",
        ...
    },
    source: { // source text language
        "<lang_code>": "<lang_readable_name>",
        ...
    },
    target: { // target translated text language
        "<lang_code>": "<lang_readable_name>",
        ...
    }
}
```

</details>

## `POST` **/translate/text**

### Translate given text

<details>
<summary>Accept</summary>

```ts
{
    query: string, // text to translate
    target: LangCode<"target"> // target translated text language
    source?: LangCode<"source">, // source text language (optional, default to auto-detect)
}
```

</details>

<details>
<summary>Return</summary>

```ts
{
    status: number,
    message: string,
    data: string // translated text
}
```

</details>

## `POST` **/translate/audio**

### Convert given text to speech. [Readme](https://github.com/thedaviddelta/lingva-scraper#text-to-speech)

<details>
<summary>Accept</summary>

```ts
{
    query: string, // text to translate
    target: LangCode<"target"> // target translated text language
}
```

</details>

<details>
<summary>Return</summary>

```ts
{
    status: number,
    message: string,
    data: number[] // an array of numbers representing a Uint8Array
}
```

</details>
