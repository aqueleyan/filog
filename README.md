<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
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

  <h3 align="center">Logger in TypeScript</h3>

  <p align="center">
    A simple and asynchronous logger written in TypeScript, ready to use in any Node.js project!
    <br />
    <a href="https://github.com/aqueleyan/filog"><strong>Explore the documentation »</strong></a>

    <br />
    <br />
    <a href="https://github.com/aqueleyan/filog">View Demo</a>
    ·
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

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
* [Node.js](https://nodejs.org)
* [NPM](https://www.npmjs.com/)

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


<!-- USAGE EXAMPLES -->
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [x] Support for creating log path directories
- [x] Support for file rotation by maximum size
- [x] Separate logs for ERROR and CRITICAL
- [ ] Customizable message formatting
- [ ] Integration with external logging services (Elasticsearch, Datadog, etc.)
- [ ] Additional documentation on best logging practices

See the [open issues](https://github.com/aqueleyan/filog/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. **Any contribution** is greatly appreciated!

If you have suggestions that would make this better, please fork the repo and create a Pull Request. You can also open an issue with the "enhancement" tag.
Don't forget to give the project a ⭐! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/MyAmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/MyAmazingFeature`)
5. Open a Pull Request

### Main :

<a href="https://github.com/aqueleyan/filog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=your-username/repo-name" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Your Name - [@your-twitter](https://twitter.com/aqueleNag) - youremail@example.com

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
