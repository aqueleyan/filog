<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** Adjust the shield links and images according to your repository and needs
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- Replace the image with your own (optional) -->
  <a href="https://github.com/aqueleyan/filog">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Filog in TypeScript</h3>

  <p align="center">
    A simple and asynchronous logger written in TypeScript.
    <br />
    <br />
<!--     <a href="https://github.com/aqueleyan/filog">View Demo</a>
    · -->
    <a href="https://github.com/aqueleyan/filog/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/aqueleyan/filog/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#props">Props</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>

  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://cdn.discordapp.com/attachments/889416728042405891/1359772303503921313/image.png?ex=67f8b224&is=67f760a4&hm=a23dc6d59667163a4993efe2e8baec63485c13046fdd477f2d9eff413b244700&)

This project provides an **asynchronous logger in TypeScript** with support for multiple log levels (DEBUG, INFO, WARN, ERROR, CRITICAL), multiple file outputs, log rotation based on file size, and an option to print to the console or not.

It can be easily integrated into any Node.js application, helping keep your logs organized and reliable. With this package, you can:

* Define a **minimum log level** to filter out irrelevant messages  
* **Automatically create directories** for the specified log paths  
* **Rotate log files** when they exceed a specified size limit  
* Store **ERROR** and **CRITICAL** logs in separate files for easier analysis  
* Choose whether or not to print logs to the **console**  

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

This project was primarily developed with:

* [![TypeScript][typescript-shield]][typescript-url]
* [![Node.js][nodejs-shield]][nodejs-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

Below are instructions to install and use this logger in your local environment.

### Prerequisites

* **Node.js** installed (version >= 12)
* **NPM** or **Yarn** installed

```sh
npm install npm@latest -g
```

### Installation

1. **Install** the package in your project:
   ```sh
   npm install --save logger-package-ts
   ```
   > Replace `logger-package-ts` with the actual name of your published npm package.

2. **Import** the logger into your TypeScript or JavaScript code:
   ```ts
   import { Logger, LogLevel } from 'logger-package-ts';
   
   const logger = new Logger({
     filePath: 'logs/app.log',
     minLogLevel: LogLevel.DEBUG,
     console: true,
     createPathDirectories: true,
     maxFileSize: 1024 * 1024 // 1 MB
   });
   
   logger.info("Information log!");
   logger.error("Oops, something went wrong!");
   ```

3. **Run** your application as usual:
   ```sh
   npm run start
   ```
   You will see the log files in `logs/app.log`, `logs/app.error.log`, and `logs/app.critical.log` whenever necessary.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!--  EXAMPLES -->
## Usage

You can use this logger in any Node.js application or TypeScript script that requires robust logging. Some use cases:

- Web applications needing to track production errors
- Back-end services running in containers that need file-based logs
- Scripts processing large volumes of data and requiring a log history

### Quick Examples

```ts
logger.debug("This is a DEBUG log, useful for development.");
logger.info("General information about the application's flow.");
logger.warn("Warning: something isn't optimal, but it's still working.");
logger.error("Error: something failed and needs attention.");
logger.critical("Critical: the application might be compromised!");
```

### Complete Example

```ts
import { Logger, LogLevel } from 'filog'

const logger = new Logger({
  filePath: 'logs/app.log',
  minLogLevel: LogLevel.DEBUG,        // Logs everything from DEBUG upwards
  console: true,                      // Prints logs to the console
  createPathDirectories: true,        // Creates the 'logs/' folder if it doesn't exist
  maxFileSize: 1024 * 1024,           // 1MB for log rotation
  errorFilePath: 'logs/app.error.log',
  criticalFilePath: 'logs/app.critical.log',
})

logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')
logger.critical('Critical message')
```

<!-- Props -->
## Props

## Props

| Property                  | Type        | Description                                                                                                                                                               | Default / Recommended              |
|---------------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| **\*filePath**           | `string`   | The base path for the main log file (mandatory).                                                                                                                          | Recommended: `"logs/app.log"`      |
| **\*maxFileSize**        | `number`   | Maximum file size (in bytes) for log rotation. When exceeded, the current file is renamed (with a timestamp), and a new file is created. If unset, no rotation is applied. | Recommended: `1048576 (1 MB)`      |
| **logName**              | `string`   | Identifies the log in the file header. If not provided, it inherits from `filePath`.                                                                                      | Inherits from `filePath`           |
| **minLogLevel**          | `LogLevel` | Defines the minimum log level to be recorded. Logs below this level are ignored.                                                                                          | `LogLevel.DEBUG`                   |
| **console**              | `boolean`  | If `true`, prints log messages to the console (in addition to writing them to files).                                                                                     | `true`                             |
| **createPathDirectories**| `boolean`  | If `true`, automatically creates directories that do not exist for `filePath`, `errorFilePath`, and `criticalFilePath`.                                                  | `true`                             |
| **errorFilePath**        | `string`   | Specific path to store **ERROR** logs (≥ 40). If not provided, it's automatically derived from `filePath` (e.g. `app.error.log`).                                         | Derived from `filePath`            |
| **criticalFilePath**     | `string`   | Specific path to store **CRITICAL** logs (50). If not provided, it's automatically derived from `filePath` (e.g. `app.critical.log`).                                     | Derived from `filePath`            |
| **showEntriesPrefix**    | `boolean`  | If `true`, appends a "new logger session" prefix when an existing file is detected (rather than newly created).                                                           | `false`                            |

> **\*** Properties marked with an asterisk (`*`) do not have a built-in default and should be explicitly set or have a recommended value.  
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Support for creating log path directories
- [x] Support for file rotation by maximum size
- [x] Separate logs for ERROR and CRITICAL

See the [open issues](https://github.com/aqueleyan/filog/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. **Any contribution** is greatly appreciated!

If you have suggestions that would make this better, please fork the repo and create a Pull Request. You can also open an issue with the "enhancement" tag.
Don't forget to give the project a ⭐! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/MyFilogFeature`)
3. Commit your Changes (`git commit -m 'Add a customize prefix'`)
4. Push to the Branch (`git push origin feature/MyFilogFeature`)
5. Open a Pull Request

### Main :

<a href="https://github.com/aqueleyan/filog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=aqueleyan/filog" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
<!-- LICENSE -->
## License

Distributed under the MIT License. See [`LICENSE`](https://github.com/aqueleyan/filog/blob/master/LICENSE.txt) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

[Twitter](https://twitter.com/aqueleNag) - fekieh35@gmail.com

Project Link: [https://github.com/aqueleyan/filog](https://github.com/aqueleyan/filog)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->


<!-- MARKDOWN LINKS & IMAGES -->

<!-- Adjust the references below according to your project -->
[contributors-shield]: https://img.shields.io/github/contributors/aqueleyan/filog.svg?style=for-the-badge
[contributors-url]: https://github.com/aqueleyan/filog/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/aqueleyan/filog.svg?style=for-the-badge
[forks-url]: https://github.com/aqueleyan/filog/network/members

[stars-shield]: https://img.shields.io/github/stars/aqueleyan/filog.svg?style=for-the-badge
[stars-url]: https://github.com/aqueleyan/filog/stargazers

[issues-shield]: https://img.shields.io/github/issues/aqueleyan/filog.svg?style=for-the-badge
[issues-url]: https://github.com/aqueleyan/filog/issues

[license-shield]: https://img.shields.io/github/license/aqueleyan/filog.svg?style=for-the-badge
[license-url]: https://github.com/aqueleyan/filog/blob/master/LICENSE.txt

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/aqueleyan

[product-screenshot]: images/screenshot.png

[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/

[nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[nodejs-url]: https://nodejs.org
