# k-meteoradar

[![Latest Release](https://img.shields.io/github/v/tag/kalisio/k-meteoradar?sort=semver&label=latest)](https://github.com/kalisio/k-meteoradar/releases)
[![CI](https://github.com/kalisio/k-meteoradar/actions/workflows/main.yaml/badge.svg)](https://github.com/kalisio/k-meteoradar/actions/workflows/main.yaml)
[![Maintainability Issues](https://sonar.portal.kalisio.com/api/project_badges/measure?project=kalisio-k-meteoradar&metric=software_quality_maintainability_issues&token=sqb_fee06c57a25acbb2bb11d99b95888f37c8050234)](https://sonar.portal.kalisio.com/dashboard?id=kalisio-k-meteoradar)
[![Coverage](https://sonar.portal.kalisio.com/api/project_badges/measure?project=kalisio-k-meteoradar&metric=coverage&token=sqb_fee06c57a25acbb2bb11d99b95888f37c8050234)](https://sonar.portal.kalisio.com/dashboard?id=kalisio-k-meteoradar)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Krawler](https://kalisio.github.io/krawler/) based service to download public [Rainfall Radar data from MeteoFrance](https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=98&id_rubrique=34).

## Description

The **k-meteoradar** job scrapes public Radar rainfall data from Meteo France public server. The downloaded images are stored in PNG format without any georeference information. 
The job first georeferenced the image and then converts it to [COG format](https://www.cogeo.org/) and copies it to a store.

The major part of the process is done using [GDAL](https://gdal.org/index.html)
 
The job scrapes the data according a specific cron expression. By default every 15 minutes.

## Configuration

| Variable | Description |
|--- | --- |
| `STORE_PATH` | The path where to store the files | - |
| `DEBUG` | Enables debug output. Set it to `krawler*` to enable full output. By default it is undefined. |

Setting the **STORE_PATH** environment variable triggers files copy to a predefined store using [Rclone](https://rclone.org/).
It is then required to define the remote store using [Rclone environment variables](https://rclone.org/docs/#environment-variables).

## Deployment

We personally use [Kargo](https://kalisio.github.io/kargo/) to deploy the service.

## Contributing

Please refer to [contribution section](./CONTRIBUTING.md) for more details.

## Authors

This project is sponsored by 

![Kalisio](https://s3.eu-central-1.amazonaws.com/kalisioscope/kalisio/kalisio-logo-black-256x84.png)

## License

This project is licensed under the MIT License - see the [license file](./LICENSE) for details
