# k-openradiation

[![Latest Release](https://img.shields.io/github/v/tag/kalisio/k-meteoradar?sort=semver&label=latest)](https://github.com/kalisio/k-meteoradar/releases)
[![Build Status](https://app.travis-ci.com/kalisio/k-meteoradar.svg?branch=master)](https://app.travis-ci.com/kalisio/k-meteoradar)

A [Krawler](https://kalisio.github.io/krawler/) based service to download public [Rainfall Radar data from MeteoFrance](https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=98&id_rubrique=34).

## Description

TOTO

## Configuration

| Variable | Description |
|--- | --- |
| `S3_ENDPOINT` | The store endpoint. | - |
| `S3_REGION` | The store region |
| `S3_ACCESS_KEY` | The key to access the store. | - |
| `S3_SECRET_ACCESS_KEY` | The secret to access the store. |
| `S3_BUCKET` | The bucket where to store the files. | - |
| `DEBUG` | Enables debug output. Set it to `krawler*` to enable full output. By default it is undefined. |

## Deployment

We personally use [Kargo](https://kalisio.github.io/kargo/) to deploy the service.

## Contributing

Please refer to [contribution section](./CONTRIBUTING.md) for more details.

## Authors

This project is sponsored by 

![Kalisio](https://s3.eu-central-1.amazonaws.com/kalisioscope/kalisio/kalisio-logo-black-256x84.png)

## License

This project is licensed under the MIT License - see the [license file](./LICENSE) for details