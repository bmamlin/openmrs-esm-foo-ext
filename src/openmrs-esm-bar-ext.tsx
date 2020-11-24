import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import { navigateToUrl } from "single-spa";
import { defineConfigSchema, useExtensionConfig } from "@openmrs/esm-config";

import { esmFooExtSchema } from "./config-schemas/openmrs-esm-foo-ext-schema";
import { openmrsRootDecorator } from "@openmrs/esm-context";
import { openmrsFetch } from "@openmrs/esm-api";

defineConfigSchema("@openmrs/esm-foo-ext-app", esmFooExtSchema);

// create the root component
export function Root() {
  const className = `omrs-link omrs-filled-neutral`;

  /*
    //This currently has a bug but once fixed, will allow us to support configuration of an extension
    const config = useExtensionConfig();
  */

  //Temporary placeholder for the config given the useExtensionConfig is a WIP
  const config = { messages: { helloWorldMessage: "goodbye world" } };
  return (
    <a
      className={className}
      href={""}
      onClick={(event) => navigateToUrl(event, "")}
    >
      {config.messages.helloWorldMessage}
    </a>
  );
}

async function fetchVitals() {
  const { data } = await openmrsFetch(
    `/ws/rest/v1/encounter/f6529e0c-2771-48cb-821b-8f11a3271452?v=custom:(uuid,encounterDatetime,obs:(uuid,value))`
  )
  return data.results      
}
//fetchVitals().then(x => setVitals(x));


// Decorate the root, this adds some additional support for translation and configuration
const decoratedRoot = openmrsRootDecorator({
  featureName: "foo-ext",
  moduleName: "@openmrs/esm-foo-ext-app",
})(Root);

// Create a single spa parcel
const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: decoratedRoot,
});

// The convention is to export these lifecycle methods for the extension as the default
// In index.ts, the extensions property expects this to be the default output from an extension
export default { bootstrap, mount, unmount };