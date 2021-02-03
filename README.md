<div align="center">
<h1>🎨 @maferland/paletteify-server</h1>

<p>Generate color palette from URL</p>
</div>

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [How to use](#how-to-use)
- [Author](#author)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to use

```shell
npm start
```

```shell
curl \
  --header "Content-Type: application/json" \
  --request POST \
  --data '{"url": "https://www.stripe.com"}' \
  http://localhost:4000/generate
```

## Author

- [Marc-Antoine Ferland](https://maferland.com)

## LICENSE

[MIT](LICENSE)
