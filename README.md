# soajs.portal.ui

The SOAJS Portal UI runs in the portal environment and offers an interface built using Angular JS that allows administrators to conduct management operations and operators to operate on the different modules of the product deployed using SOAJS across multiple environments.

No need to deploy the portal multiple times when you have multiple environments for the same product. The portal UI is smart enough to communicate with systems deployed in multiple environments from the same interface.

---
## Installation
The portal is a simple angular js application consisting of HTML, CSS & Javascript and is installed once you deploy the portal environment via the [SOAJS Dashboard](https://soajsorg.atlassian.net/wiki/spaces/DSBRD/overview) deployment wizard.
The portal environment is equiped wiht an [Nginx Server](https://www.nginx.com/) and the content of this repo is cloned and registered as a statick virtural Host.
Once the portal environment is deployed, you can access this interface via your browser by opening the domain you have entered while using the **Dashboard UI** deployment wizard.
---

## Features
Once Deployed the Portall offers:

1. a single interface to communicate with all systems deployed in multiple cloud environments
2. a rich interface driven by Personas and Access Levels
3. data and functionality isolation between environments
4. a rich and ready to use SDK to extend the portal functionality and create your own custom modules using AngularJS

---

More information is available in the SOAJS Documentation Space [Reference Link](https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61708923/UI+Module)