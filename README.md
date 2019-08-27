![alt-text](https://arkcommunity.fund/media-kit/funded/banner.png)

# Arkwallets

![alt-text](https://img.shields.io/github/last-commit/thegoldenhorde/arkvatar-ts?style=for-the-badge)
![alt-text](https://img.shields.io/github/license/highjhacker/ark-wallets?style=for-the-badge)

Monitor your Ark and bridgechains wallets with ease.

This project was funded by the Ark Community Fund. See the [proposal](https://arkcommunity.fund/proposal/wallets-monitor).

## Built with

- [Laravel](https://laravel.com/)
- [VueJS](https://vuejs.org/)

## Development setup

First of all, you will need to install Laravel. See [here](https://laravel.com/docs/5.7/installation) for more instructions.

You will also need to install Yarn. See [here](https://yarnpkg.com/lang/en/docs/install/) for more instructions.

Once Laravel and Yarn installed, clone the repository

```bash
$ git clone https://github.com/Highjhacker/ark-wallets.git
```

Navigate into the freshly cloned folder and install the dependencies

```bash
$ yarn add
$ composer install
```

Then you will need to rename  the .env.example file into .env and generate a new application key 

```bash
$ mv .env.example .env
$ php artisan key:generate
```

Finally, run `$ yarn watch`, happy coding !

## Authors

- Highjhacker

## License

ArkWallets is under MIT license. See the [LICENSE file](https://github.com/Highjhacker/ark-wallets/blob/master/LICENSE) for more informations.
