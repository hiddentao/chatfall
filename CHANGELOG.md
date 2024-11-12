# Changelog

## [1.1.2](https://github.com/hiddentao/chatfall/compare/v1.1.1...v1.1.2) (2024-11-12)


### Bug Fixes

* correct version string in docs ([a2649a7](https://github.com/hiddentao/chatfall/commit/a2649a7ca35c6963cff0001b480d91f153544e6a))


### Miscellaneous

* allow for insecure db ssl connections ([b79a04c](https://github.com/hiddentao/chatfall/commit/b79a04c9a9b017c43785364f70ea9d13512cd292))

## [1.1.1](https://github.com/hiddentao/chatfall/compare/v1.1.0...v1.1.1) (2024-11-12)


### Bug Fixes

* docs package json version sync for build ([b01978a](https://github.com/hiddentao/chatfall/commit/b01978a876dbec43c631b7a03d0c3a753883e9cd))


### Miscellaneous

* ensure website package json version is in sync with others ([0aa601d](https://github.com/hiddentao/chatfall/commit/0aa601d4f3c4eae8bbd31158cbeeda042cf48254))

## [1.1.0](https://github.com/hiddentao/chatfall/compare/v1.0.0...v1.1.0) (2024-11-12)


### Features

* docs search capability ([d947851](https://github.com/hiddentao/chatfall/commit/d9478512dcd29be428ebb6058034ad08f84cb9c9))
* dynamic version tag in docs based on package json ([ec9bb36](https://github.com/hiddentao/chatfall/commit/ec9bb366b6a3ecce4ec43eb365a9e24bd3ede183))

## [1.0.0](https://github.com/hiddentao/chatfall/compare/v0.19.0...v1.0.0) (2024-11-12)


### ⚠ BREAKING CHANGES

* initial release

### Features

* add README and LICENSE for client pkg ([3fed7ee](https://github.com/hiddentao/chatfall/commit/3fed7ee6e9b333c43d63702dc91e6a1c3ca769d6))


### Miscellaneous

* initial release ([69ae410](https://github.com/hiddentao/chatfall/commit/69ae41034b249d243c5b903709c37a16b067c827))

## [0.19.0](https://github.com/hiddentao/chatfall/compare/v0.18.0...v0.19.0) (2024-11-11)


### Features

* multi-platform docker builds ([#47](https://github.com/hiddentao/chatfall/issues/47)) ([c9e3c9a](https://github.com/hiddentao/chatfall/commit/c9e3c9a5b45e7b6c7a77d8feb0d138d75e2f715f))

## [0.18.0](https://github.com/hiddentao/chatfall/compare/v0.17.0...v0.18.0) (2024-11-11)


### Features

* docker builds ([#45](https://github.com/hiddentao/chatfall/issues/45)) ([3223848](https://github.com/hiddentao/chatfall/commit/3223848936277bd363f7b1e11b3b1825311e80a6))
* show 404 error page for bad paths ([#42](https://github.com/hiddentao/chatfall/issues/42)) ([e5f6fb4](https://github.com/hiddentao/chatfall/commit/e5f6fb457a82c2485fb202cc86653b8be043f7c1))
* website + documentation ([1dccc78](https://github.com/hiddentao/chatfall/commit/1dccc7804e9969b734be16fe810fb96a88c9fda3))


### Miscellaneous

* update repo url ([95a5407](https://github.com/hiddentao/chatfall/commit/95a5407be79ef47be14c773c358aeab8ec0f3edd))

## [0.17.0](https://github.com/hiddentao/chatfall/compare/v0.16.1...v0.17.0) (2024-10-25)


### Features

* initial mvp ([d34cc51](https://github.com/hiddentao/chatfall/commit/d34cc51e559dd0610b4423d7a2d11322b1962f9b))
* release finalization logic ([#6](https://github.com/hiddentao/chatfall/issues/6)) ([8fe9a01](https://github.com/hiddentao/chatfall/commit/8fe9a015243c66b6a2e3c6c8ab74e9efbe2705de))


### Bug Fixes

* artifacts upload step wasn't running ([2817d97](https://github.com/hiddentao/chatfall/commit/2817d97f8a35decb9aa3e8074ef8014532a5c011))
* build client files first to avoid race conditions in further build ([e625dfb](https://github.com/hiddentao/chatfall/commit/e625dfbc4151c4ef385f15d0cab58a6d8ecbef27))
* build failing because migration data script not yet generated ([93efa3f](https://github.com/hiddentao/chatfall/commit/93efa3f46a1592abbcd612d977d1ba536a252ce7))
* build workflow error ([f4140bc](https://github.com/hiddentao/chatfall/commit/f4140bc0f26eeaf2700e261d9058be31d296dffd))
* enable release-please to write to the PR ([47eb4b9](https://github.com/hiddentao/chatfall/commit/47eb4b9a5a59d2b62b89f83c43d040fc0d1ee229))
* error in npm publish script ([bf8f25f](https://github.com/hiddentao/chatfall/commit/bf8f25f0b58263cd8da20247a6bc41879b0c27b4))
* linting errors ([06037fe](https://github.com/hiddentao/chatfall/commit/06037feb452a649d79f93300e34ade285a0bc30d))
* need component names for linked-versions plugin ([dd9c779](https://github.com/hiddentao/chatfall/commit/dd9c7796274a3fda8c324496e89553753e10d6cd))
* reset package version ([93ce603](https://github.com/hiddentao/chatfall/commit/93ce60388233deea2f00166826a83ce1ab939111))


### Miscellaneous

* add github token ([ebee907](https://github.com/hiddentao/chatfall/commit/ebee9073f1ccb873f879ce137dbfe88041ae9ed1))
* add linked-versions plugin to release-please to ensure version parity ([a6f0771](https://github.com/hiddentao/chatfall/commit/a6f07719232bdc8c344161bb59dd6eb226baa094))
* create github workflow to create a release ([f401cda](https://github.com/hiddentao/chatfall/commit/f401cdaac5444c0b1b25fa8deea87a18390e66ea))
* don't create a release on a merge commit ([8b8ee26](https://github.com/hiddentao/chatfall/commit/8b8ee26cfeebe0dcb5482c29cf2ae7ef93f04402))
* don't do the build check ([8ba9bec](https://github.com/hiddentao/chatfall/commit/8ba9bec90b7be188aee1a7331753ac35e7afe4b2))
* dont include component in tag ([b3d9732](https://github.com/hiddentao/chatfall/commit/b3d9732ebc728cb3929463ffa152b9d4ba3af1b2))
* ensure the code is cloned at the right commit ([a6b6461](https://github.com/hiddentao/chatfall/commit/a6b6461e3567c913ba954680d4a9daf6826376a7))
* fresh new release ([53d65b1](https://github.com/hiddentao/chatfall/commit/53d65b1c7c8be4a0246a4bc62ca8c924b4a6d5c6))
* initial commit ([5bc3fa3](https://github.com/hiddentao/chatfall/commit/5bc3fa37d40f76894198c040769bb34cd739ed77))
* initial docs ([53be311](https://github.com/hiddentao/chatfall/commit/53be3110f5106916ccb1faf7e577b82db7c9790d))
* keep the v in the version tags ([a6e60b7](https://github.com/hiddentao/chatfall/commit/a6e60b770a370143fcd3e0080678cf9b1f167ee6))
* **main:** release 0.6.0 ([#14](https://github.com/hiddentao/chatfall/issues/14)) ([05bee84](https://github.com/hiddentao/chatfall/commit/05bee842d7706cd55d87437a97e0d630813962a2))
* **main:** release chatfall 0.2.1 ([#4](https://github.com/hiddentao/chatfall/issues/4)) ([6728721](https://github.com/hiddentao/chatfall/commit/6728721c225f9aa965d63db44ad5d46157bdb4b7))
* **main:** release chatfall 0.2.2 ([#5](https://github.com/hiddentao/chatfall/issues/5)) ([6a54568](https://github.com/hiddentao/chatfall/commit/6a545683609a04229491d6c8f15a1433254aaa86))
* **main:** release chatfall 0.3.0 ([#7](https://github.com/hiddentao/chatfall/issues/7)) ([1b9ba4e](https://github.com/hiddentao/chatfall/commit/1b9ba4eea4e2651263839cf5ef327fb7de5b0c69))
* **main:** release chatfall 0.4.0 ([#8](https://github.com/hiddentao/chatfall/issues/8)) ([c0380fc](https://github.com/hiddentao/chatfall/commit/c0380fcc3f61b19b91fb8cf78e6dbe90152ef1b7))
* **main:** release chatfall 0.4.1 ([#9](https://github.com/hiddentao/chatfall/issues/9)) ([6a00ae3](https://github.com/hiddentao/chatfall/commit/6a00ae372d2e70a0f1c476ffb91827bfab11bcaf))
* **main:** release chatfall 0.4.2 ([#10](https://github.com/hiddentao/chatfall/issues/10)) ([fb1321e](https://github.com/hiddentao/chatfall/commit/fb1321ef596c1c970c492f84e3f8711f4e9f25d8))
* **main:** release chatfall 0.4.3 ([#11](https://github.com/hiddentao/chatfall/issues/11)) ([dd9f1e1](https://github.com/hiddentao/chatfall/commit/dd9f1e14043305c88db88ec6f27402d5274f5919))
* **main:** release chatfall 0.4.4 ([#12](https://github.com/hiddentao/chatfall/issues/12)) ([0cb03a1](https://github.com/hiddentao/chatfall/commit/0cb03a129a0b50dc065a701c81dd6305a73b038c))
* **main:** release chatfall 0.5.0 ([#13](https://github.com/hiddentao/chatfall/issues/13)) ([9a22354](https://github.com/hiddentao/chatfall/commit/9a22354cefbb978cba2db17d9866df7fe2ec48f8))
* minor upate to enable a new build to take place ([3ec8b26](https://github.com/hiddentao/chatfall/commit/3ec8b26aba3b2f729cf716104dd94c21595e8850))
* no more monorepo releasing ([d837db0](https://github.com/hiddentao/chatfall/commit/d837db0c40a11100f45737ee2d5f7429ff2c44ca))
* npm publishing now a separate job ([6019760](https://github.com/hiddentao/chatfall/commit/6019760e4d50cc7b6b007ae4d224ef0596d7c541))
* one more attempt at linked-verisons ([5ca184c](https://github.com/hiddentao/chatfall/commit/5ca184c4a6af77883a7b57f6a88f24bff1678227))
* output release outputs for debugging ([3522e64](https://github.com/hiddentao/chatfall/commit/3522e64357d201a9906e2404041f7f42e42da9e3))
* publish the release when a new release tag gets added ([8408814](https://github.com/hiddentao/chatfall/commit/8408814a4345f0f54d838b01d642a56d964ed939))
* refactor the release script ([262662c](https://github.com/hiddentao/chatfall/commit/262662cc9f9f4cb4566bd8d1f0f398b9c27d50d1))
* release main ([#16](https://github.com/hiddentao/chatfall/issues/16)) ([10bffe8](https://github.com/hiddentao/chatfall/commit/10bffe8654da102a6c54c4176ed483f263a2174b))
* release main ([#17](https://github.com/hiddentao/chatfall/issues/17)) ([8b684a0](https://github.com/hiddentao/chatfall/commit/8b684a01c4ee4b88116453a8559bde6a028f6129))
* release main ([#18](https://github.com/hiddentao/chatfall/issues/18)) ([5181af9](https://github.com/hiddentao/chatfall/commit/5181af9dbef403e5556420ff51425038d7626fab))
* release main ([#19](https://github.com/hiddentao/chatfall/issues/19)) ([3abcb98](https://github.com/hiddentao/chatfall/commit/3abcb980d1f93f78c811c7a0dae91cf2ee46795f))
* release main ([#21](https://github.com/hiddentao/chatfall/issues/21)) ([ccf13a4](https://github.com/hiddentao/chatfall/commit/ccf13a498740eb4b15892b46b25aa0ec31cdfa80))
* release main ([#3](https://github.com/hiddentao/chatfall/issues/3)) ([cacad41](https://github.com/hiddentao/chatfall/commit/cacad414364eac5d2c54ec59911e396cd1c54d9d))
* release trigger ([17f6a24](https://github.com/hiddentao/chatfall/commit/17f6a2439e5b5e13a81d3cf5255651c39d4a668a))
* release-please changelog at top level ([d6afef5](https://github.com/hiddentao/chatfall/commit/d6afef52b4fd057451d3715425f7d2ae65027f97))
* **release:** release 0.10.0 ([#31](https://github.com/hiddentao/chatfall/issues/31)) ([56d67a2](https://github.com/hiddentao/chatfall/commit/56d67a2d76d70c5139e4d15605f48caa371e9525))
* **release:** release 0.11.0 ([#32](https://github.com/hiddentao/chatfall/issues/32)) ([8da3da7](https://github.com/hiddentao/chatfall/commit/8da3da787617d2a26dc2acf9d1f33552cb690f47))
* **release:** release 0.12.0 ([#33](https://github.com/hiddentao/chatfall/issues/33)) ([43040a1](https://github.com/hiddentao/chatfall/commit/43040a11f227d2f5469c434a9fb45f3acd150ac5))
* **release:** release 0.12.1 ([#34](https://github.com/hiddentao/chatfall/issues/34)) ([6491859](https://github.com/hiddentao/chatfall/commit/64918594b3782148ef858701ef4e039ec47a6989))
* **release:** release 0.13.0 ([#35](https://github.com/hiddentao/chatfall/issues/35)) ([57f50f8](https://github.com/hiddentao/chatfall/commit/57f50f86088e92b91906237052b42a7c84b47ee9))
* **release:** release 0.13.1 ([#36](https://github.com/hiddentao/chatfall/issues/36)) ([eabd9f5](https://github.com/hiddentao/chatfall/commit/eabd9f559c3c053c0bec0505bf9e82dd46937b27))
* **release:** release 0.14.0 ([#37](https://github.com/hiddentao/chatfall/issues/37)) ([4bd420a](https://github.com/hiddentao/chatfall/commit/4bd420ab56e845534a296f148ebe16742c5ada7a))
* **release:** release 0.15.0 ([#38](https://github.com/hiddentao/chatfall/issues/38)) ([481dbe8](https://github.com/hiddentao/chatfall/commit/481dbe83109eca0d399c6cb658c607ffaacd18e2))
* **release:** release 0.16.0 ([#39](https://github.com/hiddentao/chatfall/issues/39)) ([4f744a7](https://github.com/hiddentao/chatfall/commit/4f744a77d2ec5939a897a8d2eea3da20c7ab4096))
* **release:** release 0.16.1 ([#40](https://github.com/hiddentao/chatfall/issues/40)) ([d1c5174](https://github.com/hiddentao/chatfall/commit/d1c5174b30a553e5495f49dbfda5355442a080df))
* **release:** release 0.9.0 ([#29](https://github.com/hiddentao/chatfall/issues/29)) ([1d98375](https://github.com/hiddentao/chatfall/commit/1d9837507a9f6718898d283ae97d25b8bec083b1))
* **release:** release 0.9.1 ([#30](https://github.com/hiddentao/chatfall/issues/30)) ([6a0fca3](https://github.com/hiddentao/chatfall/commit/6a0fca3b6cb36dfaedb56c2a4803259f923b1d97))
* remove husky redundant code ([97eb10c](https://github.com/hiddentao/chatfall/commit/97eb10cb5c8da7ea1e3f63052721609834459c62))
* reset build attributres ([228a72b](https://github.com/hiddentao/chatfall/commit/228a72bb7ddaba9f0c0f02db7828726ec8e7421f))
* reset build params ([1c5f30d](https://github.com/hiddentao/chatfall/commit/1c5f30dbce4ec7baa156f0f63a46e5948a45255d))
* reset buld params ([86913e8](https://github.com/hiddentao/chatfall/commit/86913e80640e8cfb56adea1068eb2c436007a56b))
* reset changelog so that we can get a new build ([dd33f75](https://github.com/hiddentao/chatfall/commit/dd33f756b6cbb6e2d932b54caf03273fcf9b26c1))
* revert previous changes ([391c053](https://github.com/hiddentao/chatfall/commit/391c053baba56c8f2b810e4cd2ecc6f285c67750))
* run on any tags being created ([b78c36f](https://github.com/hiddentao/chatfall/commit/b78c36f29ccb1c490f288e4787987f2e3aaf5bf2))
* set NPM registry token before publishing ([d34e901](https://github.com/hiddentao/chatfall/commit/d34e90142bfce8011ba2d7cffbb9ea77e5759b2d))
* show deleted comments in normal view ([1400e1a](https://github.com/hiddentao/chatfall/commit/1400e1a22f837b7a340a232a5a6ef5989aea0c6c))
* split out npm publishing into separate workflow ([2fdab79](https://github.com/hiddentao/chatfall/commit/2fdab79615ed6ba862ab7c50291d6cb07d0c46b5))
* sync package versions ([81f34ff](https://github.com/hiddentao/chatfall/commit/81f34ffd9f9b6354e454f31ce758d3476fc8d031))
* sync package.json versions ([ca9da18](https://github.com/hiddentao/chatfall/commit/ca9da18d150e153801a28712a18fb0586b440d1c))
* trigger rebuild ([1848508](https://github.com/hiddentao/chatfall/commit/18485080d84105fda26f754c04d697350270152b))
* try and undo previous changes to get publish release working again ([a8e5698](https://github.com/hiddentao/chatfall/commit/a8e56989522893fe181bd69fcac91db1125e7bf5))
* try pull request title pattern again ([a734415](https://github.com/hiddentao/chatfall/commit/a7344150516974cb61f87028d2b62410016ed455))
* try without separate PRs ([a74ce06](https://github.com/hiddentao/chatfall/commit/a74ce06f5480a925c214d04a062f4b3b26911368))
* update license ([4cb903c](https://github.com/hiddentao/chatfall/commit/4cb903cc8850a3f8ea10a9d526678f363186a43b))
* update names in config json ([630608d](https://github.com/hiddentao/chatfall/commit/630608d51b23c7c4b844601de52b225947b5d5ee))
* update package versions before building ([ee4fbdc](https://github.com/hiddentao/chatfall/commit/ee4fbdc1fc86e33c5681b4514abc0da22cb40d7c))
* update release config to try and PR working properly ([9c1d00a](https://github.com/hiddentao/chatfall/commit/9c1d00a714b6e6901f4b5364b9cb72703b7938e6))
* update step name ([7abd0f7](https://github.com/hiddentao/chatfall/commit/7abd0f76092fd4cfd6011b85289c4f994b83d4a5))
* update step name ([846465c](https://github.com/hiddentao/chatfall/commit/846465c7f636828bbce3ee66d31a656bca2ec383))
* upload release artifacts to release tag ([0f67d1a](https://github.com/hiddentao/chatfall/commit/0f67d1afc6096fbe267228167e1c99cf4497c406))
* work towards publishing client NPM package ([eee8858](https://github.com/hiddentao/chatfall/commit/eee8858cf3818b608b80746c001d471be2d9607d))

## [0.16.1](https://github.com/hiddentao/chatfall/compare/v0.16.0...v0.16.1) (2024-10-25)


### Miscellaneous

* npm publishing now a separate job ([6019760](https://github.com/hiddentao/chatfall/commit/6019760e4d50cc7b6b007ae4d224ef0596d7c541))

## [0.16.0](https://github.com/hiddentao/chatfall/compare/v0.15.0...v0.16.0) (2024-10-25)


### Features

* initial mvp ([d34cc51](https://github.com/hiddentao/chatfall/commit/d34cc51e559dd0610b4423d7a2d11322b1962f9b))
* release finalization logic ([#6](https://github.com/hiddentao/chatfall/issues/6)) ([8fe9a01](https://github.com/hiddentao/chatfall/commit/8fe9a015243c66b6a2e3c6c8ab74e9efbe2705de))


### Bug Fixes

* artifacts upload step wasn't running ([2817d97](https://github.com/hiddentao/chatfall/commit/2817d97f8a35decb9aa3e8074ef8014532a5c011))
* build client files first to avoid race conditions in further build ([e625dfb](https://github.com/hiddentao/chatfall/commit/e625dfbc4151c4ef385f15d0cab58a6d8ecbef27))
* build failing because migration data script not yet generated ([93efa3f](https://github.com/hiddentao/chatfall/commit/93efa3f46a1592abbcd612d977d1ba536a252ce7))
* build workflow error ([f4140bc](https://github.com/hiddentao/chatfall/commit/f4140bc0f26eeaf2700e261d9058be31d296dffd))
* enable release-please to write to the PR ([47eb4b9](https://github.com/hiddentao/chatfall/commit/47eb4b9a5a59d2b62b89f83c43d040fc0d1ee229))
* linting errors ([06037fe](https://github.com/hiddentao/chatfall/commit/06037feb452a649d79f93300e34ade285a0bc30d))
* need component names for linked-versions plugin ([dd9c779](https://github.com/hiddentao/chatfall/commit/dd9c7796274a3fda8c324496e89553753e10d6cd))
* reset package version ([93ce603](https://github.com/hiddentao/chatfall/commit/93ce60388233deea2f00166826a83ce1ab939111))


### Miscellaneous

* add github token ([ebee907](https://github.com/hiddentao/chatfall/commit/ebee9073f1ccb873f879ce137dbfe88041ae9ed1))
* add linked-versions plugin to release-please to ensure version parity ([a6f0771](https://github.com/hiddentao/chatfall/commit/a6f07719232bdc8c344161bb59dd6eb226baa094))
* create github workflow to create a release ([f401cda](https://github.com/hiddentao/chatfall/commit/f401cdaac5444c0b1b25fa8deea87a18390e66ea))
* don't create a release on a merge commit ([8b8ee26](https://github.com/hiddentao/chatfall/commit/8b8ee26cfeebe0dcb5482c29cf2ae7ef93f04402))
* don't do the build check ([8ba9bec](https://github.com/hiddentao/chatfall/commit/8ba9bec90b7be188aee1a7331753ac35e7afe4b2))
* dont include component in tag ([b3d9732](https://github.com/hiddentao/chatfall/commit/b3d9732ebc728cb3929463ffa152b9d4ba3af1b2))
* ensure the code is cloned at the right commit ([a6b6461](https://github.com/hiddentao/chatfall/commit/a6b6461e3567c913ba954680d4a9daf6826376a7))
* fresh new release ([53d65b1](https://github.com/hiddentao/chatfall/commit/53d65b1c7c8be4a0246a4bc62ca8c924b4a6d5c6))
* initial commit ([5bc3fa3](https://github.com/hiddentao/chatfall/commit/5bc3fa37d40f76894198c040769bb34cd739ed77))
* initial docs ([53be311](https://github.com/hiddentao/chatfall/commit/53be3110f5106916ccb1faf7e577b82db7c9790d))
* keep the v in the version tags ([a6e60b7](https://github.com/hiddentao/chatfall/commit/a6e60b770a370143fcd3e0080678cf9b1f167ee6))
* **main:** release 0.6.0 ([#14](https://github.com/hiddentao/chatfall/issues/14)) ([05bee84](https://github.com/hiddentao/chatfall/commit/05bee842d7706cd55d87437a97e0d630813962a2))
* **main:** release chatfall 0.2.1 ([#4](https://github.com/hiddentao/chatfall/issues/4)) ([6728721](https://github.com/hiddentao/chatfall/commit/6728721c225f9aa965d63db44ad5d46157bdb4b7))
* **main:** release chatfall 0.2.2 ([#5](https://github.com/hiddentao/chatfall/issues/5)) ([6a54568](https://github.com/hiddentao/chatfall/commit/6a545683609a04229491d6c8f15a1433254aaa86))
* **main:** release chatfall 0.3.0 ([#7](https://github.com/hiddentao/chatfall/issues/7)) ([1b9ba4e](https://github.com/hiddentao/chatfall/commit/1b9ba4eea4e2651263839cf5ef327fb7de5b0c69))
* **main:** release chatfall 0.4.0 ([#8](https://github.com/hiddentao/chatfall/issues/8)) ([c0380fc](https://github.com/hiddentao/chatfall/commit/c0380fcc3f61b19b91fb8cf78e6dbe90152ef1b7))
* **main:** release chatfall 0.4.1 ([#9](https://github.com/hiddentao/chatfall/issues/9)) ([6a00ae3](https://github.com/hiddentao/chatfall/commit/6a00ae372d2e70a0f1c476ffb91827bfab11bcaf))
* **main:** release chatfall 0.4.2 ([#10](https://github.com/hiddentao/chatfall/issues/10)) ([fb1321e](https://github.com/hiddentao/chatfall/commit/fb1321ef596c1c970c492f84e3f8711f4e9f25d8))
* **main:** release chatfall 0.4.3 ([#11](https://github.com/hiddentao/chatfall/issues/11)) ([dd9f1e1](https://github.com/hiddentao/chatfall/commit/dd9f1e14043305c88db88ec6f27402d5274f5919))
* **main:** release chatfall 0.4.4 ([#12](https://github.com/hiddentao/chatfall/issues/12)) ([0cb03a1](https://github.com/hiddentao/chatfall/commit/0cb03a129a0b50dc065a701c81dd6305a73b038c))
* **main:** release chatfall 0.5.0 ([#13](https://github.com/hiddentao/chatfall/issues/13)) ([9a22354](https://github.com/hiddentao/chatfall/commit/9a22354cefbb978cba2db17d9866df7fe2ec48f8))
* minor upate to enable a new build to take place ([3ec8b26](https://github.com/hiddentao/chatfall/commit/3ec8b26aba3b2f729cf716104dd94c21595e8850))
* no more monorepo releasing ([d837db0](https://github.com/hiddentao/chatfall/commit/d837db0c40a11100f45737ee2d5f7429ff2c44ca))
* one more attempt at linked-verisons ([5ca184c](https://github.com/hiddentao/chatfall/commit/5ca184c4a6af77883a7b57f6a88f24bff1678227))
* output release outputs for debugging ([3522e64](https://github.com/hiddentao/chatfall/commit/3522e64357d201a9906e2404041f7f42e42da9e3))
* publish the release when a new release tag gets added ([8408814](https://github.com/hiddentao/chatfall/commit/8408814a4345f0f54d838b01d642a56d964ed939))
* refactor the release script ([262662c](https://github.com/hiddentao/chatfall/commit/262662cc9f9f4cb4566bd8d1f0f398b9c27d50d1))
* release main ([#16](https://github.com/hiddentao/chatfall/issues/16)) ([10bffe8](https://github.com/hiddentao/chatfall/commit/10bffe8654da102a6c54c4176ed483f263a2174b))
* release main ([#17](https://github.com/hiddentao/chatfall/issues/17)) ([8b684a0](https://github.com/hiddentao/chatfall/commit/8b684a01c4ee4b88116453a8559bde6a028f6129))
* release main ([#18](https://github.com/hiddentao/chatfall/issues/18)) ([5181af9](https://github.com/hiddentao/chatfall/commit/5181af9dbef403e5556420ff51425038d7626fab))
* release main ([#19](https://github.com/hiddentao/chatfall/issues/19)) ([3abcb98](https://github.com/hiddentao/chatfall/commit/3abcb980d1f93f78c811c7a0dae91cf2ee46795f))
* release main ([#21](https://github.com/hiddentao/chatfall/issues/21)) ([ccf13a4](https://github.com/hiddentao/chatfall/commit/ccf13a498740eb4b15892b46b25aa0ec31cdfa80))
* release main ([#3](https://github.com/hiddentao/chatfall/issues/3)) ([cacad41](https://github.com/hiddentao/chatfall/commit/cacad414364eac5d2c54ec59911e396cd1c54d9d))
* release trigger ([17f6a24](https://github.com/hiddentao/chatfall/commit/17f6a2439e5b5e13a81d3cf5255651c39d4a668a))
* release-please changelog at top level ([d6afef5](https://github.com/hiddentao/chatfall/commit/d6afef52b4fd057451d3715425f7d2ae65027f97))
* **release:** release 0.10.0 ([#31](https://github.com/hiddentao/chatfall/issues/31)) ([56d67a2](https://github.com/hiddentao/chatfall/commit/56d67a2d76d70c5139e4d15605f48caa371e9525))
* **release:** release 0.11.0 ([#32](https://github.com/hiddentao/chatfall/issues/32)) ([8da3da7](https://github.com/hiddentao/chatfall/commit/8da3da787617d2a26dc2acf9d1f33552cb690f47))
* **release:** release 0.12.0 ([#33](https://github.com/hiddentao/chatfall/issues/33)) ([43040a1](https://github.com/hiddentao/chatfall/commit/43040a11f227d2f5469c434a9fb45f3acd150ac5))
* **release:** release 0.12.1 ([#34](https://github.com/hiddentao/chatfall/issues/34)) ([6491859](https://github.com/hiddentao/chatfall/commit/64918594b3782148ef858701ef4e039ec47a6989))
* **release:** release 0.13.0 ([#35](https://github.com/hiddentao/chatfall/issues/35)) ([57f50f8](https://github.com/hiddentao/chatfall/commit/57f50f86088e92b91906237052b42a7c84b47ee9))
* **release:** release 0.13.1 ([#36](https://github.com/hiddentao/chatfall/issues/36)) ([eabd9f5](https://github.com/hiddentao/chatfall/commit/eabd9f559c3c053c0bec0505bf9e82dd46937b27))
* **release:** release 0.14.0 ([#37](https://github.com/hiddentao/chatfall/issues/37)) ([4bd420a](https://github.com/hiddentao/chatfall/commit/4bd420ab56e845534a296f148ebe16742c5ada7a))
* **release:** release 0.15.0 ([#38](https://github.com/hiddentao/chatfall/issues/38)) ([481dbe8](https://github.com/hiddentao/chatfall/commit/481dbe83109eca0d399c6cb658c607ffaacd18e2))
* **release:** release 0.9.0 ([#29](https://github.com/hiddentao/chatfall/issues/29)) ([1d98375](https://github.com/hiddentao/chatfall/commit/1d9837507a9f6718898d283ae97d25b8bec083b1))
* **release:** release 0.9.1 ([#30](https://github.com/hiddentao/chatfall/issues/30)) ([6a0fca3](https://github.com/hiddentao/chatfall/commit/6a0fca3b6cb36dfaedb56c2a4803259f923b1d97))
* remove husky redundant code ([97eb10c](https://github.com/hiddentao/chatfall/commit/97eb10cb5c8da7ea1e3f63052721609834459c62))
* reset build attributres ([228a72b](https://github.com/hiddentao/chatfall/commit/228a72bb7ddaba9f0c0f02db7828726ec8e7421f))
* reset build params ([1c5f30d](https://github.com/hiddentao/chatfall/commit/1c5f30dbce4ec7baa156f0f63a46e5948a45255d))
* reset buld params ([86913e8](https://github.com/hiddentao/chatfall/commit/86913e80640e8cfb56adea1068eb2c436007a56b))
* reset changelog so that we can get a new build ([dd33f75](https://github.com/hiddentao/chatfall/commit/dd33f756b6cbb6e2d932b54caf03273fcf9b26c1))
* revert previous changes ([391c053](https://github.com/hiddentao/chatfall/commit/391c053baba56c8f2b810e4cd2ecc6f285c67750))
* run on any tags being created ([b78c36f](https://github.com/hiddentao/chatfall/commit/b78c36f29ccb1c490f288e4787987f2e3aaf5bf2))
* set NPM registry token before publishing ([d34e901](https://github.com/hiddentao/chatfall/commit/d34e90142bfce8011ba2d7cffbb9ea77e5759b2d))
* show deleted comments in normal view ([1400e1a](https://github.com/hiddentao/chatfall/commit/1400e1a22f837b7a340a232a5a6ef5989aea0c6c))
* split out npm publishing into separate workflow ([2fdab79](https://github.com/hiddentao/chatfall/commit/2fdab79615ed6ba862ab7c50291d6cb07d0c46b5))
* sync package versions ([81f34ff](https://github.com/hiddentao/chatfall/commit/81f34ffd9f9b6354e454f31ce758d3476fc8d031))
* sync package.json versions ([ca9da18](https://github.com/hiddentao/chatfall/commit/ca9da18d150e153801a28712a18fb0586b440d1c))
* trigger rebuild ([1848508](https://github.com/hiddentao/chatfall/commit/18485080d84105fda26f754c04d697350270152b))
* try and undo previous changes to get publish release working again ([a8e5698](https://github.com/hiddentao/chatfall/commit/a8e56989522893fe181bd69fcac91db1125e7bf5))
* try pull request title pattern again ([a734415](https://github.com/hiddentao/chatfall/commit/a7344150516974cb61f87028d2b62410016ed455))
* try without separate PRs ([a74ce06](https://github.com/hiddentao/chatfall/commit/a74ce06f5480a925c214d04a062f4b3b26911368))
* update license ([4cb903c](https://github.com/hiddentao/chatfall/commit/4cb903cc8850a3f8ea10a9d526678f363186a43b))
* update names in config json ([630608d](https://github.com/hiddentao/chatfall/commit/630608d51b23c7c4b844601de52b225947b5d5ee))
* update package versions before building ([ee4fbdc](https://github.com/hiddentao/chatfall/commit/ee4fbdc1fc86e33c5681b4514abc0da22cb40d7c))
* update release config to try and PR working properly ([9c1d00a](https://github.com/hiddentao/chatfall/commit/9c1d00a714b6e6901f4b5364b9cb72703b7938e6))
* update step name ([7abd0f7](https://github.com/hiddentao/chatfall/commit/7abd0f76092fd4cfd6011b85289c4f994b83d4a5))
* update step name ([846465c](https://github.com/hiddentao/chatfall/commit/846465c7f636828bbce3ee66d31a656bca2ec383))
* upload release artifacts to release tag ([0f67d1a](https://github.com/hiddentao/chatfall/commit/0f67d1afc6096fbe267228167e1c99cf4497c406))
* work towards publishing client NPM package ([eee8858](https://github.com/hiddentao/chatfall/commit/eee8858cf3818b608b80746c001d471be2d9607d))

## [0.15.0](https://github.com/hiddentao/chatfall/compare/v0.14.0...v0.15.0) (2024-10-25)


### Features

* initial mvp ([d34cc51](https://github.com/hiddentao/chatfall/commit/d34cc51e559dd0610b4423d7a2d11322b1962f9b))
* release finalization logic ([#6](https://github.com/hiddentao/chatfall/issues/6)) ([8fe9a01](https://github.com/hiddentao/chatfall/commit/8fe9a015243c66b6a2e3c6c8ab74e9efbe2705de))


### Bug Fixes

* artifacts upload step wasn't running ([2817d97](https://github.com/hiddentao/chatfall/commit/2817d97f8a35decb9aa3e8074ef8014532a5c011))
* build client files first to avoid race conditions in further build ([e625dfb](https://github.com/hiddentao/chatfall/commit/e625dfbc4151c4ef385f15d0cab58a6d8ecbef27))
* build failing because migration data script not yet generated ([93efa3f](https://github.com/hiddentao/chatfall/commit/93efa3f46a1592abbcd612d977d1ba536a252ce7))
* build workflow error ([f4140bc](https://github.com/hiddentao/chatfall/commit/f4140bc0f26eeaf2700e261d9058be31d296dffd))
* enable release-please to write to the PR ([47eb4b9](https://github.com/hiddentao/chatfall/commit/47eb4b9a5a59d2b62b89f83c43d040fc0d1ee229))
* linting errors ([06037fe](https://github.com/hiddentao/chatfall/commit/06037feb452a649d79f93300e34ade285a0bc30d))
* need component names for linked-versions plugin ([dd9c779](https://github.com/hiddentao/chatfall/commit/dd9c7796274a3fda8c324496e89553753e10d6cd))
* reset package version ([93ce603](https://github.com/hiddentao/chatfall/commit/93ce60388233deea2f00166826a83ce1ab939111))


### Miscellaneous

* add github token ([ebee907](https://github.com/hiddentao/chatfall/commit/ebee9073f1ccb873f879ce137dbfe88041ae9ed1))
* add linked-versions plugin to release-please to ensure version parity ([a6f0771](https://github.com/hiddentao/chatfall/commit/a6f07719232bdc8c344161bb59dd6eb226baa094))
* create github workflow to create a release ([f401cda](https://github.com/hiddentao/chatfall/commit/f401cdaac5444c0b1b25fa8deea87a18390e66ea))
* don't create a release on a merge commit ([8b8ee26](https://github.com/hiddentao/chatfall/commit/8b8ee26cfeebe0dcb5482c29cf2ae7ef93f04402))
* don't do the build check ([8ba9bec](https://github.com/hiddentao/chatfall/commit/8ba9bec90b7be188aee1a7331753ac35e7afe4b2))
* dont include component in tag ([b3d9732](https://github.com/hiddentao/chatfall/commit/b3d9732ebc728cb3929463ffa152b9d4ba3af1b2))
* ensure the code is cloned at the right commit ([a6b6461](https://github.com/hiddentao/chatfall/commit/a6b6461e3567c913ba954680d4a9daf6826376a7))
* fresh new release ([53d65b1](https://github.com/hiddentao/chatfall/commit/53d65b1c7c8be4a0246a4bc62ca8c924b4a6d5c6))
* initial commit ([5bc3fa3](https://github.com/hiddentao/chatfall/commit/5bc3fa37d40f76894198c040769bb34cd739ed77))
* initial docs ([53be311](https://github.com/hiddentao/chatfall/commit/53be3110f5106916ccb1faf7e577b82db7c9790d))
* keep the v in the version tags ([a6e60b7](https://github.com/hiddentao/chatfall/commit/a6e60b770a370143fcd3e0080678cf9b1f167ee6))
* **main:** release 0.6.0 ([#14](https://github.com/hiddentao/chatfall/issues/14)) ([05bee84](https://github.com/hiddentao/chatfall/commit/05bee842d7706cd55d87437a97e0d630813962a2))
* **main:** release chatfall 0.2.1 ([#4](https://github.com/hiddentao/chatfall/issues/4)) ([6728721](https://github.com/hiddentao/chatfall/commit/6728721c225f9aa965d63db44ad5d46157bdb4b7))
* **main:** release chatfall 0.2.2 ([#5](https://github.com/hiddentao/chatfall/issues/5)) ([6a54568](https://github.com/hiddentao/chatfall/commit/6a545683609a04229491d6c8f15a1433254aaa86))
* **main:** release chatfall 0.3.0 ([#7](https://github.com/hiddentao/chatfall/issues/7)) ([1b9ba4e](https://github.com/hiddentao/chatfall/commit/1b9ba4eea4e2651263839cf5ef327fb7de5b0c69))
* **main:** release chatfall 0.4.0 ([#8](https://github.com/hiddentao/chatfall/issues/8)) ([c0380fc](https://github.com/hiddentao/chatfall/commit/c0380fcc3f61b19b91fb8cf78e6dbe90152ef1b7))
* **main:** release chatfall 0.4.1 ([#9](https://github.com/hiddentao/chatfall/issues/9)) ([6a00ae3](https://github.com/hiddentao/chatfall/commit/6a00ae372d2e70a0f1c476ffb91827bfab11bcaf))
* **main:** release chatfall 0.4.2 ([#10](https://github.com/hiddentao/chatfall/issues/10)) ([fb1321e](https://github.com/hiddentao/chatfall/commit/fb1321ef596c1c970c492f84e3f8711f4e9f25d8))
* **main:** release chatfall 0.4.3 ([#11](https://github.com/hiddentao/chatfall/issues/11)) ([dd9f1e1](https://github.com/hiddentao/chatfall/commit/dd9f1e14043305c88db88ec6f27402d5274f5919))
* **main:** release chatfall 0.4.4 ([#12](https://github.com/hiddentao/chatfall/issues/12)) ([0cb03a1](https://github.com/hiddentao/chatfall/commit/0cb03a129a0b50dc065a701c81dd6305a73b038c))
* **main:** release chatfall 0.5.0 ([#13](https://github.com/hiddentao/chatfall/issues/13)) ([9a22354](https://github.com/hiddentao/chatfall/commit/9a22354cefbb978cba2db17d9866df7fe2ec48f8))
* minor upate to enable a new build to take place ([3ec8b26](https://github.com/hiddentao/chatfall/commit/3ec8b26aba3b2f729cf716104dd94c21595e8850))
* no more monorepo releasing ([d837db0](https://github.com/hiddentao/chatfall/commit/d837db0c40a11100f45737ee2d5f7429ff2c44ca))
* one more attempt at linked-verisons ([5ca184c](https://github.com/hiddentao/chatfall/commit/5ca184c4a6af77883a7b57f6a88f24bff1678227))
* output release outputs for debugging ([3522e64](https://github.com/hiddentao/chatfall/commit/3522e64357d201a9906e2404041f7f42e42da9e3))
* publish the release when a new release tag gets added ([8408814](https://github.com/hiddentao/chatfall/commit/8408814a4345f0f54d838b01d642a56d964ed939))
* refactor the release script ([262662c](https://github.com/hiddentao/chatfall/commit/262662cc9f9f4cb4566bd8d1f0f398b9c27d50d1))
* release main ([#16](https://github.com/hiddentao/chatfall/issues/16)) ([10bffe8](https://github.com/hiddentao/chatfall/commit/10bffe8654da102a6c54c4176ed483f263a2174b))
* release main ([#17](https://github.com/hiddentao/chatfall/issues/17)) ([8b684a0](https://github.com/hiddentao/chatfall/commit/8b684a01c4ee4b88116453a8559bde6a028f6129))
* release main ([#18](https://github.com/hiddentao/chatfall/issues/18)) ([5181af9](https://github.com/hiddentao/chatfall/commit/5181af9dbef403e5556420ff51425038d7626fab))
* release main ([#19](https://github.com/hiddentao/chatfall/issues/19)) ([3abcb98](https://github.com/hiddentao/chatfall/commit/3abcb980d1f93f78c811c7a0dae91cf2ee46795f))
* release main ([#21](https://github.com/hiddentao/chatfall/issues/21)) ([ccf13a4](https://github.com/hiddentao/chatfall/commit/ccf13a498740eb4b15892b46b25aa0ec31cdfa80))
* release main ([#3](https://github.com/hiddentao/chatfall/issues/3)) ([cacad41](https://github.com/hiddentao/chatfall/commit/cacad414364eac5d2c54ec59911e396cd1c54d9d))
* release trigger ([17f6a24](https://github.com/hiddentao/chatfall/commit/17f6a2439e5b5e13a81d3cf5255651c39d4a668a))
* release-please changelog at top level ([d6afef5](https://github.com/hiddentao/chatfall/commit/d6afef52b4fd057451d3715425f7d2ae65027f97))
* **release:** release 0.10.0 ([#31](https://github.com/hiddentao/chatfall/issues/31)) ([56d67a2](https://github.com/hiddentao/chatfall/commit/56d67a2d76d70c5139e4d15605f48caa371e9525))
* **release:** release 0.11.0 ([#32](https://github.com/hiddentao/chatfall/issues/32)) ([8da3da7](https://github.com/hiddentao/chatfall/commit/8da3da787617d2a26dc2acf9d1f33552cb690f47))
* **release:** release 0.12.0 ([#33](https://github.com/hiddentao/chatfall/issues/33)) ([43040a1](https://github.com/hiddentao/chatfall/commit/43040a11f227d2f5469c434a9fb45f3acd150ac5))
* **release:** release 0.12.1 ([#34](https://github.com/hiddentao/chatfall/issues/34)) ([6491859](https://github.com/hiddentao/chatfall/commit/64918594b3782148ef858701ef4e039ec47a6989))
* **release:** release 0.13.0 ([#35](https://github.com/hiddentao/chatfall/issues/35)) ([57f50f8](https://github.com/hiddentao/chatfall/commit/57f50f86088e92b91906237052b42a7c84b47ee9))
* **release:** release 0.13.1 ([#36](https://github.com/hiddentao/chatfall/issues/36)) ([eabd9f5](https://github.com/hiddentao/chatfall/commit/eabd9f559c3c053c0bec0505bf9e82dd46937b27))
* **release:** release 0.14.0 ([#37](https://github.com/hiddentao/chatfall/issues/37)) ([4bd420a](https://github.com/hiddentao/chatfall/commit/4bd420ab56e845534a296f148ebe16742c5ada7a))
* **release:** release 0.9.0 ([#29](https://github.com/hiddentao/chatfall/issues/29)) ([1d98375](https://github.com/hiddentao/chatfall/commit/1d9837507a9f6718898d283ae97d25b8bec083b1))
* **release:** release 0.9.1 ([#30](https://github.com/hiddentao/chatfall/issues/30)) ([6a0fca3](https://github.com/hiddentao/chatfall/commit/6a0fca3b6cb36dfaedb56c2a4803259f923b1d97))
* remove husky redundant code ([97eb10c](https://github.com/hiddentao/chatfall/commit/97eb10cb5c8da7ea1e3f63052721609834459c62))
* reset build attributres ([228a72b](https://github.com/hiddentao/chatfall/commit/228a72bb7ddaba9f0c0f02db7828726ec8e7421f))
* reset build params ([1c5f30d](https://github.com/hiddentao/chatfall/commit/1c5f30dbce4ec7baa156f0f63a46e5948a45255d))
* reset buld params ([86913e8](https://github.com/hiddentao/chatfall/commit/86913e80640e8cfb56adea1068eb2c436007a56b))
* reset changelog so that we can get a new build ([dd33f75](https://github.com/hiddentao/chatfall/commit/dd33f756b6cbb6e2d932b54caf03273fcf9b26c1))
* revert previous changes ([391c053](https://github.com/hiddentao/chatfall/commit/391c053baba56c8f2b810e4cd2ecc6f285c67750))
* run on any tags being created ([b78c36f](https://github.com/hiddentao/chatfall/commit/b78c36f29ccb1c490f288e4787987f2e3aaf5bf2))
* set NPM registry token before publishing ([d34e901](https://github.com/hiddentao/chatfall/commit/d34e90142bfce8011ba2d7cffbb9ea77e5759b2d))
* show deleted comments in normal view ([1400e1a](https://github.com/hiddentao/chatfall/commit/1400e1a22f837b7a340a232a5a6ef5989aea0c6c))
* split out npm publishing into separate workflow ([2fdab79](https://github.com/hiddentao/chatfall/commit/2fdab79615ed6ba862ab7c50291d6cb07d0c46b5))
* sync package versions ([81f34ff](https://github.com/hiddentao/chatfall/commit/81f34ffd9f9b6354e454f31ce758d3476fc8d031))
* sync package.json versions ([ca9da18](https://github.com/hiddentao/chatfall/commit/ca9da18d150e153801a28712a18fb0586b440d1c))
* trigger rebuild ([1848508](https://github.com/hiddentao/chatfall/commit/18485080d84105fda26f754c04d697350270152b))
* try and undo previous changes to get publish release working again ([a8e5698](https://github.com/hiddentao/chatfall/commit/a8e56989522893fe181bd69fcac91db1125e7bf5))
* try pull request title pattern again ([a734415](https://github.com/hiddentao/chatfall/commit/a7344150516974cb61f87028d2b62410016ed455))
* try without separate PRs ([a74ce06](https://github.com/hiddentao/chatfall/commit/a74ce06f5480a925c214d04a062f4b3b26911368))
* update license ([4cb903c](https://github.com/hiddentao/chatfall/commit/4cb903cc8850a3f8ea10a9d526678f363186a43b))
* update names in config json ([630608d](https://github.com/hiddentao/chatfall/commit/630608d51b23c7c4b844601de52b225947b5d5ee))
* update release config to try and PR working properly ([9c1d00a](https://github.com/hiddentao/chatfall/commit/9c1d00a714b6e6901f4b5364b9cb72703b7938e6))
* update step name ([846465c](https://github.com/hiddentao/chatfall/commit/846465c7f636828bbce3ee66d31a656bca2ec383))
* upload release artifacts to release tag ([0f67d1a](https://github.com/hiddentao/chatfall/commit/0f67d1afc6096fbe267228167e1c99cf4497c406))
* work towards publishing client NPM package ([eee8858](https://github.com/hiddentao/chatfall/commit/eee8858cf3818b608b80746c001d471be2d9607d))

## [0.14.0](https://github.com/hiddentao/chatfall/compare/v0.13.1...v0.14.0) (2024-10-25)


### Features

* initial mvp ([d34cc51](https://github.com/hiddentao/chatfall/commit/d34cc51e559dd0610b4423d7a2d11322b1962f9b))
* release finalization logic ([#6](https://github.com/hiddentao/chatfall/issues/6)) ([8fe9a01](https://github.com/hiddentao/chatfall/commit/8fe9a015243c66b6a2e3c6c8ab74e9efbe2705de))


### Bug Fixes

* artifacts upload step wasn't running ([2817d97](https://github.com/hiddentao/chatfall/commit/2817d97f8a35decb9aa3e8074ef8014532a5c011))
* build client files first to avoid race conditions in further build ([e625dfb](https://github.com/hiddentao/chatfall/commit/e625dfbc4151c4ef385f15d0cab58a6d8ecbef27))
* build failing because migration data script not yet generated ([93efa3f](https://github.com/hiddentao/chatfall/commit/93efa3f46a1592abbcd612d977d1ba536a252ce7))
* build workflow error ([f4140bc](https://github.com/hiddentao/chatfall/commit/f4140bc0f26eeaf2700e261d9058be31d296dffd))
* enable release-please to write to the PR ([47eb4b9](https://github.com/hiddentao/chatfall/commit/47eb4b9a5a59d2b62b89f83c43d040fc0d1ee229))
* linting errors ([06037fe](https://github.com/hiddentao/chatfall/commit/06037feb452a649d79f93300e34ade285a0bc30d))
* need component names for linked-versions plugin ([dd9c779](https://github.com/hiddentao/chatfall/commit/dd9c7796274a3fda8c324496e89553753e10d6cd))
* reset package version ([93ce603](https://github.com/hiddentao/chatfall/commit/93ce60388233deea2f00166826a83ce1ab939111))


### Miscellaneous

* add github token ([ebee907](https://github.com/hiddentao/chatfall/commit/ebee9073f1ccb873f879ce137dbfe88041ae9ed1))
* add linked-versions plugin to release-please to ensure version parity ([a6f0771](https://github.com/hiddentao/chatfall/commit/a6f07719232bdc8c344161bb59dd6eb226baa094))
* create github workflow to create a release ([f401cda](https://github.com/hiddentao/chatfall/commit/f401cdaac5444c0b1b25fa8deea87a18390e66ea))
* don't create a release on a merge commit ([8b8ee26](https://github.com/hiddentao/chatfall/commit/8b8ee26cfeebe0dcb5482c29cf2ae7ef93f04402))
* don't do the build check ([8ba9bec](https://github.com/hiddentao/chatfall/commit/8ba9bec90b7be188aee1a7331753ac35e7afe4b2))
* dont include component in tag ([b3d9732](https://github.com/hiddentao/chatfall/commit/b3d9732ebc728cb3929463ffa152b9d4ba3af1b2))
* ensure the code is cloned at the right commit ([a6b6461](https://github.com/hiddentao/chatfall/commit/a6b6461e3567c913ba954680d4a9daf6826376a7))
* fresh new release ([53d65b1](https://github.com/hiddentao/chatfall/commit/53d65b1c7c8be4a0246a4bc62ca8c924b4a6d5c6))
* initial commit ([5bc3fa3](https://github.com/hiddentao/chatfall/commit/5bc3fa37d40f76894198c040769bb34cd739ed77))
* initial docs ([53be311](https://github.com/hiddentao/chatfall/commit/53be3110f5106916ccb1faf7e577b82db7c9790d))
* keep the v in the version tags ([a6e60b7](https://github.com/hiddentao/chatfall/commit/a6e60b770a370143fcd3e0080678cf9b1f167ee6))
* **main:** release 0.6.0 ([#14](https://github.com/hiddentao/chatfall/issues/14)) ([05bee84](https://github.com/hiddentao/chatfall/commit/05bee842d7706cd55d87437a97e0d630813962a2))
* **main:** release chatfall 0.2.1 ([#4](https://github.com/hiddentao/chatfall/issues/4)) ([6728721](https://github.com/hiddentao/chatfall/commit/6728721c225f9aa965d63db44ad5d46157bdb4b7))
* **main:** release chatfall 0.2.2 ([#5](https://github.com/hiddentao/chatfall/issues/5)) ([6a54568](https://github.com/hiddentao/chatfall/commit/6a545683609a04229491d6c8f15a1433254aaa86))
* **main:** release chatfall 0.3.0 ([#7](https://github.com/hiddentao/chatfall/issues/7)) ([1b9ba4e](https://github.com/hiddentao/chatfall/commit/1b9ba4eea4e2651263839cf5ef327fb7de5b0c69))
* **main:** release chatfall 0.4.0 ([#8](https://github.com/hiddentao/chatfall/issues/8)) ([c0380fc](https://github.com/hiddentao/chatfall/commit/c0380fcc3f61b19b91fb8cf78e6dbe90152ef1b7))
* **main:** release chatfall 0.4.1 ([#9](https://github.com/hiddentao/chatfall/issues/9)) ([6a00ae3](https://github.com/hiddentao/chatfall/commit/6a00ae372d2e70a0f1c476ffb91827bfab11bcaf))
* **main:** release chatfall 0.4.2 ([#10](https://github.com/hiddentao/chatfall/issues/10)) ([fb1321e](https://github.com/hiddentao/chatfall/commit/fb1321ef596c1c970c492f84e3f8711f4e9f25d8))
* **main:** release chatfall 0.4.3 ([#11](https://github.com/hiddentao/chatfall/issues/11)) ([dd9f1e1](https://github.com/hiddentao/chatfall/commit/dd9f1e14043305c88db88ec6f27402d5274f5919))
* **main:** release chatfall 0.4.4 ([#12](https://github.com/hiddentao/chatfall/issues/12)) ([0cb03a1](https://github.com/hiddentao/chatfall/commit/0cb03a129a0b50dc065a701c81dd6305a73b038c))
* **main:** release chatfall 0.5.0 ([#13](https://github.com/hiddentao/chatfall/issues/13)) ([9a22354](https://github.com/hiddentao/chatfall/commit/9a22354cefbb978cba2db17d9866df7fe2ec48f8))
* minor upate to enable a new build to take place ([3ec8b26](https://github.com/hiddentao/chatfall/commit/3ec8b26aba3b2f729cf716104dd94c21595e8850))
* no more monorepo releasing ([d837db0](https://github.com/hiddentao/chatfall/commit/d837db0c40a11100f45737ee2d5f7429ff2c44ca))
* one more attempt at linked-verisons ([5ca184c](https://github.com/hiddentao/chatfall/commit/5ca184c4a6af77883a7b57f6a88f24bff1678227))
* output release outputs for debugging ([3522e64](https://github.com/hiddentao/chatfall/commit/3522e64357d201a9906e2404041f7f42e42da9e3))
* publish the release when a new release tag gets added ([8408814](https://github.com/hiddentao/chatfall/commit/8408814a4345f0f54d838b01d642a56d964ed939))
* refactor the release script ([262662c](https://github.com/hiddentao/chatfall/commit/262662cc9f9f4cb4566bd8d1f0f398b9c27d50d1))
* release main ([#16](https://github.com/hiddentao/chatfall/issues/16)) ([10bffe8](https://github.com/hiddentao/chatfall/commit/10bffe8654da102a6c54c4176ed483f263a2174b))
* release main ([#17](https://github.com/hiddentao/chatfall/issues/17)) ([8b684a0](https://github.com/hiddentao/chatfall/commit/8b684a01c4ee4b88116453a8559bde6a028f6129))
* release main ([#18](https://github.com/hiddentao/chatfall/issues/18)) ([5181af9](https://github.com/hiddentao/chatfall/commit/5181af9dbef403e5556420ff51425038d7626fab))
* release main ([#19](https://github.com/hiddentao/chatfall/issues/19)) ([3abcb98](https://github.com/hiddentao/chatfall/commit/3abcb980d1f93f78c811c7a0dae91cf2ee46795f))
* release main ([#21](https://github.com/hiddentao/chatfall/issues/21)) ([ccf13a4](https://github.com/hiddentao/chatfall/commit/ccf13a498740eb4b15892b46b25aa0ec31cdfa80))
* release main ([#3](https://github.com/hiddentao/chatfall/issues/3)) ([cacad41](https://github.com/hiddentao/chatfall/commit/cacad414364eac5d2c54ec59911e396cd1c54d9d))
* release trigger ([17f6a24](https://github.com/hiddentao/chatfall/commit/17f6a2439e5b5e13a81d3cf5255651c39d4a668a))
* release-please changelog at top level ([d6afef5](https://github.com/hiddentao/chatfall/commit/d6afef52b4fd057451d3715425f7d2ae65027f97))
* **release:** release 0.10.0 ([#31](https://github.com/hiddentao/chatfall/issues/31)) ([56d67a2](https://github.com/hiddentao/chatfall/commit/56d67a2d76d70c5139e4d15605f48caa371e9525))
* **release:** release 0.11.0 ([#32](https://github.com/hiddentao/chatfall/issues/32)) ([8da3da7](https://github.com/hiddentao/chatfall/commit/8da3da787617d2a26dc2acf9d1f33552cb690f47))
* **release:** release 0.12.0 ([#33](https://github.com/hiddentao/chatfall/issues/33)) ([43040a1](https://github.com/hiddentao/chatfall/commit/43040a11f227d2f5469c434a9fb45f3acd150ac5))
* **release:** release 0.12.1 ([#34](https://github.com/hiddentao/chatfall/issues/34)) ([6491859](https://github.com/hiddentao/chatfall/commit/64918594b3782148ef858701ef4e039ec47a6989))
* **release:** release 0.13.0 ([#35](https://github.com/hiddentao/chatfall/issues/35)) ([57f50f8](https://github.com/hiddentao/chatfall/commit/57f50f86088e92b91906237052b42a7c84b47ee9))
* **release:** release 0.13.1 ([#36](https://github.com/hiddentao/chatfall/issues/36)) ([eabd9f5](https://github.com/hiddentao/chatfall/commit/eabd9f559c3c053c0bec0505bf9e82dd46937b27))
* **release:** release 0.9.0 ([#29](https://github.com/hiddentao/chatfall/issues/29)) ([1d98375](https://github.com/hiddentao/chatfall/commit/1d9837507a9f6718898d283ae97d25b8bec083b1))
* **release:** release 0.9.1 ([#30](https://github.com/hiddentao/chatfall/issues/30)) ([6a0fca3](https://github.com/hiddentao/chatfall/commit/6a0fca3b6cb36dfaedb56c2a4803259f923b1d97))
* remove husky redundant code ([97eb10c](https://github.com/hiddentao/chatfall/commit/97eb10cb5c8da7ea1e3f63052721609834459c62))
* reset build attributres ([228a72b](https://github.com/hiddentao/chatfall/commit/228a72bb7ddaba9f0c0f02db7828726ec8e7421f))
* reset build params ([1c5f30d](https://github.com/hiddentao/chatfall/commit/1c5f30dbce4ec7baa156f0f63a46e5948a45255d))
* reset buld params ([86913e8](https://github.com/hiddentao/chatfall/commit/86913e80640e8cfb56adea1068eb2c436007a56b))
* reset changelog so that we can get a new build ([dd33f75](https://github.com/hiddentao/chatfall/commit/dd33f756b6cbb6e2d932b54caf03273fcf9b26c1))
* revert previous changes ([391c053](https://github.com/hiddentao/chatfall/commit/391c053baba56c8f2b810e4cd2ecc6f285c67750))
* run on any tags being created ([b78c36f](https://github.com/hiddentao/chatfall/commit/b78c36f29ccb1c490f288e4787987f2e3aaf5bf2))
* set NPM registry token before publishing ([d34e901](https://github.com/hiddentao/chatfall/commit/d34e90142bfce8011ba2d7cffbb9ea77e5759b2d))
* show deleted comments in normal view ([1400e1a](https://github.com/hiddentao/chatfall/commit/1400e1a22f837b7a340a232a5a6ef5989aea0c6c))
* split out npm publishing into separate workflow ([2fdab79](https://github.com/hiddentao/chatfall/commit/2fdab79615ed6ba862ab7c50291d6cb07d0c46b5))
* sync package versions ([81f34ff](https://github.com/hiddentao/chatfall/commit/81f34ffd9f9b6354e454f31ce758d3476fc8d031))
* trigger rebuild ([1848508](https://github.com/hiddentao/chatfall/commit/18485080d84105fda26f754c04d697350270152b))
* try and undo previous changes to get publish release working again ([a8e5698](https://github.com/hiddentao/chatfall/commit/a8e56989522893fe181bd69fcac91db1125e7bf5))
* try pull request title pattern again ([a734415](https://github.com/hiddentao/chatfall/commit/a7344150516974cb61f87028d2b62410016ed455))
* try without separate PRs ([a74ce06](https://github.com/hiddentao/chatfall/commit/a74ce06f5480a925c214d04a062f4b3b26911368))
* update license ([4cb903c](https://github.com/hiddentao/chatfall/commit/4cb903cc8850a3f8ea10a9d526678f363186a43b))
* update names in config json ([630608d](https://github.com/hiddentao/chatfall/commit/630608d51b23c7c4b844601de52b225947b5d5ee))
* update release config to try and PR working properly ([9c1d00a](https://github.com/hiddentao/chatfall/commit/9c1d00a714b6e6901f4b5364b9cb72703b7938e6))
* upload release artifacts to release tag ([0f67d1a](https://github.com/hiddentao/chatfall/commit/0f67d1afc6096fbe267228167e1c99cf4497c406))
* work towards publishing client NPM package ([eee8858](https://github.com/hiddentao/chatfall/commit/eee8858cf3818b608b80746c001d471be2d9607d))

## [0.13.1](https://github.com/hiddentao/chatfall/compare/v0.13.0...v0.13.1) (2024-10-25)


### Miscellaneous

* run on any tags being created ([b78c36f](https://github.com/hiddentao/chatfall/commit/b78c36f29ccb1c490f288e4787987f2e3aaf5bf2))

## [0.13.0](https://github.com/hiddentao/chatfall/compare/v0.12.0...v0.13.0) (2024-10-25)


### Features

* initial mvp ([d34cc51](https://github.com/hiddentao/chatfall/commit/d34cc51e559dd0610b4423d7a2d11322b1962f9b))
* release finalization logic ([#6](https://github.com/hiddentao/chatfall/issues/6)) ([8fe9a01](https://github.com/hiddentao/chatfall/commit/8fe9a015243c66b6a2e3c6c8ab74e9efbe2705de))


### Bug Fixes

* artifacts upload step wasn't running ([2817d97](https://github.com/hiddentao/chatfall/commit/2817d97f8a35decb9aa3e8074ef8014532a5c011))
* build client files first to avoid race conditions in further build ([e625dfb](https://github.com/hiddentao/chatfall/commit/e625dfbc4151c4ef385f15d0cab58a6d8ecbef27))
* build failing because migration data script not yet generated ([93efa3f](https://github.com/hiddentao/chatfall/commit/93efa3f46a1592abbcd612d977d1ba536a252ce7))
* build workflow error ([f4140bc](https://github.com/hiddentao/chatfall/commit/f4140bc0f26eeaf2700e261d9058be31d296dffd))
* enable release-please to write to the PR ([47eb4b9](https://github.com/hiddentao/chatfall/commit/47eb4b9a5a59d2b62b89f83c43d040fc0d1ee229))
* linting errors ([06037fe](https://github.com/hiddentao/chatfall/commit/06037feb452a649d79f93300e34ade285a0bc30d))
* need component names for linked-versions plugin ([dd9c779](https://github.com/hiddentao/chatfall/commit/dd9c7796274a3fda8c324496e89553753e10d6cd))
* reset package version ([93ce603](https://github.com/hiddentao/chatfall/commit/93ce60388233deea2f00166826a83ce1ab939111))


### Miscellaneous

* add github token ([ebee907](https://github.com/hiddentao/chatfall/commit/ebee9073f1ccb873f879ce137dbfe88041ae9ed1))
* add linked-versions plugin to release-please to ensure version parity ([a6f0771](https://github.com/hiddentao/chatfall/commit/a6f07719232bdc8c344161bb59dd6eb226baa094))
* create github workflow to create a release ([f401cda](https://github.com/hiddentao/chatfall/commit/f401cdaac5444c0b1b25fa8deea87a18390e66ea))
* don't create a release on a merge commit ([8b8ee26](https://github.com/hiddentao/chatfall/commit/8b8ee26cfeebe0dcb5482c29cf2ae7ef93f04402))
* don't do the build check ([8ba9bec](https://github.com/hiddentao/chatfall/commit/8ba9bec90b7be188aee1a7331753ac35e7afe4b2))
* dont include component in tag ([b3d9732](https://github.com/hiddentao/chatfall/commit/b3d9732ebc728cb3929463ffa152b9d4ba3af1b2))
* ensure the code is cloned at the right commit ([a6b6461](https://github.com/hiddentao/chatfall/commit/a6b6461e3567c913ba954680d4a9daf6826376a7))
* fresh new release ([53d65b1](https://github.com/hiddentao/chatfall/commit/53d65b1c7c8be4a0246a4bc62ca8c924b4a6d5c6))
* initial commit ([5bc3fa3](https://github.com/hiddentao/chatfall/commit/5bc3fa37d40f76894198c040769bb34cd739ed77))
* initial docs ([53be311](https://github.com/hiddentao/chatfall/commit/53be3110f5106916ccb1faf7e577b82db7c9790d))
* keep the v in the version tags ([a6e60b7](https://github.com/hiddentao/chatfall/commit/a6e60b770a370143fcd3e0080678cf9b1f167ee6))
* **main:** release 0.6.0 ([#14](https://github.com/hiddentao/chatfall/issues/14)) ([05bee84](https://github.com/hiddentao/chatfall/commit/05bee842d7706cd55d87437a97e0d630813962a2))
* **main:** release chatfall 0.2.1 ([#4](https://github.com/hiddentao/chatfall/issues/4)) ([6728721](https://github.com/hiddentao/chatfall/commit/6728721c225f9aa965d63db44ad5d46157bdb4b7))
* **main:** release chatfall 0.2.2 ([#5](https://github.com/hiddentao/chatfall/issues/5)) ([6a54568](https://github.com/hiddentao/chatfall/commit/6a545683609a04229491d6c8f15a1433254aaa86))
* **main:** release chatfall 0.3.0 ([#7](https://github.com/hiddentao/chatfall/issues/7)) ([1b9ba4e](https://github.com/hiddentao/chatfall/commit/1b9ba4eea4e2651263839cf5ef327fb7de5b0c69))
* **main:** release chatfall 0.4.0 ([#8](https://github.com/hiddentao/chatfall/issues/8)) ([c0380fc](https://github.com/hiddentao/chatfall/commit/c0380fcc3f61b19b91fb8cf78e6dbe90152ef1b7))
* **main:** release chatfall 0.4.1 ([#9](https://github.com/hiddentao/chatfall/issues/9)) ([6a00ae3](https://github.com/hiddentao/chatfall/commit/6a00ae372d2e70a0f1c476ffb91827bfab11bcaf))
* **main:** release chatfall 0.4.2 ([#10](https://github.com/hiddentao/chatfall/issues/10)) ([fb1321e](https://github.com/hiddentao/chatfall/commit/fb1321ef596c1c970c492f84e3f8711f4e9f25d8))
* **main:** release chatfall 0.4.3 ([#11](https://github.com/hiddentao/chatfall/issues/11)) ([dd9f1e1](https://github.com/hiddentao/chatfall/commit/dd9f1e14043305c88db88ec6f27402d5274f5919))
* **main:** release chatfall 0.4.4 ([#12](https://github.com/hiddentao/chatfall/issues/12)) ([0cb03a1](https://github.com/hiddentao/chatfall/commit/0cb03a129a0b50dc065a701c81dd6305a73b038c))
* **main:** release chatfall 0.5.0 ([#13](https://github.com/hiddentao/chatfall/issues/13)) ([9a22354](https://github.com/hiddentao/chatfall/commit/9a22354cefbb978cba2db17d9866df7fe2ec48f8))
* minor upate to enable a new build to take place ([3ec8b26](https://github.com/hiddentao/chatfall/commit/3ec8b26aba3b2f729cf716104dd94c21595e8850))
* one more attempt at linked-verisons ([5ca184c](https://github.com/hiddentao/chatfall/commit/5ca184c4a6af77883a7b57f6a88f24bff1678227))
* output release outputs for debugging ([3522e64](https://github.com/hiddentao/chatfall/commit/3522e64357d201a9906e2404041f7f42e42da9e3))
* publish the release when a new release tag gets added ([8408814](https://github.com/hiddentao/chatfall/commit/8408814a4345f0f54d838b01d642a56d964ed939))
* refactor the release script ([262662c](https://github.com/hiddentao/chatfall/commit/262662cc9f9f4cb4566bd8d1f0f398b9c27d50d1))
* release main ([#16](https://github.com/hiddentao/chatfall/issues/16)) ([10bffe8](https://github.com/hiddentao/chatfall/commit/10bffe8654da102a6c54c4176ed483f263a2174b))
* release main ([#17](https://github.com/hiddentao/chatfall/issues/17)) ([8b684a0](https://github.com/hiddentao/chatfall/commit/8b684a01c4ee4b88116453a8559bde6a028f6129))
* release main ([#18](https://github.com/hiddentao/chatfall/issues/18)) ([5181af9](https://github.com/hiddentao/chatfall/commit/5181af9dbef403e5556420ff51425038d7626fab))
* release main ([#19](https://github.com/hiddentao/chatfall/issues/19)) ([3abcb98](https://github.com/hiddentao/chatfall/commit/3abcb980d1f93f78c811c7a0dae91cf2ee46795f))
* release main ([#21](https://github.com/hiddentao/chatfall/issues/21)) ([ccf13a4](https://github.com/hiddentao/chatfall/commit/ccf13a498740eb4b15892b46b25aa0ec31cdfa80))
* release main ([#3](https://github.com/hiddentao/chatfall/issues/3)) ([cacad41](https://github.com/hiddentao/chatfall/commit/cacad414364eac5d2c54ec59911e396cd1c54d9d))
* release trigger ([17f6a24](https://github.com/hiddentao/chatfall/commit/17f6a2439e5b5e13a81d3cf5255651c39d4a668a))
* release-please changelog at top level ([d6afef5](https://github.com/hiddentao/chatfall/commit/d6afef52b4fd057451d3715425f7d2ae65027f97))
* **release:** release 0.10.0 ([#31](https://github.com/hiddentao/chatfall/issues/31)) ([56d67a2](https://github.com/hiddentao/chatfall/commit/56d67a2d76d70c5139e4d15605f48caa371e9525))
* **release:** release 0.11.0 ([#32](https://github.com/hiddentao/chatfall/issues/32)) ([8da3da7](https://github.com/hiddentao/chatfall/commit/8da3da787617d2a26dc2acf9d1f33552cb690f47))
* **release:** release 0.12.0 ([#33](https://github.com/hiddentao/chatfall/issues/33)) ([43040a1](https://github.com/hiddentao/chatfall/commit/43040a11f227d2f5469c434a9fb45f3acd150ac5))
* **release:** release 0.12.1 ([#34](https://github.com/hiddentao/chatfall/issues/34)) ([6491859](https://github.com/hiddentao/chatfall/commit/64918594b3782148ef858701ef4e039ec47a6989))
* **release:** release 0.9.0 ([#29](https://github.com/hiddentao/chatfall/issues/29)) ([1d98375](https://github.com/hiddentao/chatfall/commit/1d9837507a9f6718898d283ae97d25b8bec083b1))
* **release:** release 0.9.1 ([#30](https://github.com/hiddentao/chatfall/issues/30)) ([6a0fca3](https://github.com/hiddentao/chatfall/commit/6a0fca3b6cb36dfaedb56c2a4803259f923b1d97))
* remove husky redundant code ([97eb10c](https://github.com/hiddentao/chatfall/commit/97eb10cb5c8da7ea1e3f63052721609834459c62))
* reset build attributres ([228a72b](https://github.com/hiddentao/chatfall/commit/228a72bb7ddaba9f0c0f02db7828726ec8e7421f))
* reset build params ([1c5f30d](https://github.com/hiddentao/chatfall/commit/1c5f30dbce4ec7baa156f0f63a46e5948a45255d))
* reset buld params ([86913e8](https://github.com/hiddentao/chatfall/commit/86913e80640e8cfb56adea1068eb2c436007a56b))
* reset changelog so that we can get a new build ([dd33f75](https://github.com/hiddentao/chatfall/commit/dd33f756b6cbb6e2d932b54caf03273fcf9b26c1))
* revert previous changes ([391c053](https://github.com/hiddentao/chatfall/commit/391c053baba56c8f2b810e4cd2ecc6f285c67750))
* set NPM registry token before publishing ([d34e901](https://github.com/hiddentao/chatfall/commit/d34e90142bfce8011ba2d7cffbb9ea77e5759b2d))
* show deleted comments in normal view ([1400e1a](https://github.com/hiddentao/chatfall/commit/1400e1a22f837b7a340a232a5a6ef5989aea0c6c))
* split out npm publishing into separate workflow ([2fdab79](https://github.com/hiddentao/chatfall/commit/2fdab79615ed6ba862ab7c50291d6cb07d0c46b5))
* sync package versions ([81f34ff](https://github.com/hiddentao/chatfall/commit/81f34ffd9f9b6354e454f31ce758d3476fc8d031))
* trigger rebuild ([1848508](https://github.com/hiddentao/chatfall/commit/18485080d84105fda26f754c04d697350270152b))
* try and undo previous changes to get publish release working again ([a8e5698](https://github.com/hiddentao/chatfall/commit/a8e56989522893fe181bd69fcac91db1125e7bf5))
* try pull request title pattern again ([a734415](https://github.com/hiddentao/chatfall/commit/a7344150516974cb61f87028d2b62410016ed455))
* try without separate PRs ([a74ce06](https://github.com/hiddentao/chatfall/commit/a74ce06f5480a925c214d04a062f4b3b26911368))
* update license ([4cb903c](https://github.com/hiddentao/chatfall/commit/4cb903cc8850a3f8ea10a9d526678f363186a43b))
* update names in config json ([630608d](https://github.com/hiddentao/chatfall/commit/630608d51b23c7c4b844601de52b225947b5d5ee))
* update release config to try and PR working properly ([9c1d00a](https://github.com/hiddentao/chatfall/commit/9c1d00a714b6e6901f4b5364b9cb72703b7938e6))
* upload release artifacts to release tag ([0f67d1a](https://github.com/hiddentao/chatfall/commit/0f67d1afc6096fbe267228167e1c99cf4497c406))
* work towards publishing client NPM package ([eee8858](https://github.com/hiddentao/chatfall/commit/eee8858cf3818b608b80746c001d471be2d9607d))
