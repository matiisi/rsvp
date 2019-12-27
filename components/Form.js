import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import moment from "moment";

import DatePicker from "./DatePicker";
import {
  Form,
  Hidden,
  AnimatedContainer,
  Label,
  Input,
  CompanionButton,
  StyledTextArea,
  ErrorMessage,
  MenuGroup,
  MenuImage,
  CheckboxLabel,
  CheckboxInput,
  CheckboxSpan,
  CheckboxText,
  Button,
} from "./styles/FormStyles";
import LoadingHeart from "./LoadingHeart";

const hiddenInputsForNetlifyForms = (
  <Hidden>
    {[
      "name",
      "attending",
      "staying",
      "shuttle",
      "menu",
      "dietaryRestrictions",
      "songs",
      "message",
    ].map(i => (
      <input name={i} key={i} />
    ))}
  </Hidden>
);

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  console.log(props.person);
  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <Input {...field} {...props} />
      {meta.touched && meta.error ? (
        <ErrorMessage>{meta.error}</ErrorMessage>
      ) : null}
    </>
  );
};

const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <StyledTextArea {...field} {...props} />
      {meta.touched && meta.error ? (
        <ErrorMessage>{meta.error}</ErrorMessage>
      ) : null}
    </>
  );
};

const RadioSelection = ({ label, ...props }) => {
  const [field] = useField(props);
  return (
    <>
      <Label>
        <Input {...field} {...props} />
        <MenuImage src={props.image} title={props.value.toLowerCase()} />
      </Label>
    </>
  );
};

const DateSelection = ({ label }) => {
  const context = useFormikContext();
  return (
    <>
      <Label htmlFor={label}>{label}</Label>
      <DatePicker id="dateRange" context={context} />
    </>
  );
};

const Checkbox = ({ children, ...props }) => {
  const [field] = useField({ ...props, type: "checkbox" });
  return (
    <>
      <CheckboxLabel>
        <CheckboxInput type="checkbox" {...field} {...props} />
        <CheckboxSpan />
        <CheckboxText>{children}</CheckboxText>
      </CheckboxLabel>
    </>
  );
};

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

const rsvpForm = ({ selected, attending, postSubmit }) => {
  const [additionalPerson, setAdditionalPerson] = useState(false);
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("nameRequired")),
    menu: Yup.string(),
    dietaryRestrictions: Yup.string().max(
      256,
      "I feel you, but the limit here is 256 characters..."
    ),
    message: Yup.string().max(256, "Message too long."),
    songs: Yup.string().max(256, "The night is only so long..."),
    shuttle: Yup.boolean(),
  });

  const submit = values => {
    const arriving = moment(values.staying.arriving).format("D.M.");
    const departing = moment(values.staying.departing).format("D.M.");
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": "rsvp",
        attending: attending,
        ...values,
        staying: `${arriving}-${departing}${
          values.shuttle ? " <needs ride>" : ""
        }`,
        shuttle: values.shuttle,
      }),
    };
    console.log(options);
    fetch("/", options)
      .then(() => {
        console.log("Form submitted successfully!");
        postSubmit({
          attending: attending,
          shuttle: values.shuttle,
        });
      })
      .catch(error => console.log(error));
  };

  const nameInput = <></>;

  const dateRangePicker = (
    <>
      <DateSelection label={t("staying")} />
    </>
  );

  const textArea = (
    <TextArea
      label={t("message")}
      name="message"
      rows="5"
      placeholder={t("messagePlaceholder")}
    />
  );

  const songs = (
    <TextInput
      label={t("songs")}
      name="songs"
      type="text"
      placeholder={t("songsPlaceholder")}
    />
  );

  const menuSelection = (
    <>
      <Label htmlFor="menu">{t("menu")}</Label>
      <MenuGroup id="menu">
        <RadioSelection
          type="radio"
          name="menu"
          value="Chicken"
          image="chicken.svg"
        />
        <RadioSelection type="radio" name="menu" value="Pork" image="pig.svg" />
        <RadioSelection
          type="radio"
          name="menu"
          value="Vege"
          image="vege.svg"
        />
      </MenuGroup>
    </>
  );

  const dietaryRestrictions = (
    <TextInput
      label={t("dietaryRestrictions")}
      name="dietaryRestrictions"
      type="text"
      placeholder={t("dietaryRestrictionsPlaceholder")}
    />
  );

  const airportShuttle = (
    <>
      <Label htmlFor="airportShuttle">{t("airportShuttleLabel")}</Label>
      <Checkbox id="airportShuttle" name="shuttle">
        {t("needShuttle")}
      </Checkbox>
    </>
  );

  const attendingFields = (
    <>
      {nameInput}
      {menuSelection}
      {dietaryRestrictions}
      {dateRangePicker}
      {airportShuttle}
      {songs}
      {textArea}
    </>
  );

  return (
    <Formik
      initialValues={{
        name: "",
        companionName: "",
        staying: { arriving: null, departing: null },
        shuttle: false,
        menu: "",
        companionMenu: "",
        dietaryRestrictions: "",
        companionDietaryRestrictions: "",
        message: "",
        songs: "",
      }}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {({
        values,
        dirty,
        isValid,
        setFieldValue,
        isSubmitting,
        handleSubmit,
      }) => (
        <Form name="rsvp" data-netlify="true" onSubmit={handleSubmit}>
          {hiddenInputsForNetlifyForms}
          {selected && (
            <AnimatedContainer>
              {attending ? (
                <>
                  <TextInput
                    label={t("name")}
                    name="name"
                    type="text"
                    placeholder={t("namePlaceholder")}
                  />
                  {additionalPerson ? (
                    <TextInput
                      label={t("companion")}
                      name="companionName"
                      type="text"
                      placeholder={t("namePlaceholder")}
                    />
                  ) : (
                    <CompanionButton onClick={() => setAdditionalPerson(true)}>
                      <span>add companion</span>
                    </CompanionButton>
                  )}
                  <Label htmlFor="menu">
                    {`${t("menu")}${
                      additionalPerson && values.name
                        ? " (" + values.name + ")"
                        : ""
                    }`}
                  </Label>
                  <MenuGroup id="menu">
                    <RadioSelection
                      type="radio"
                      name="menu"
                      value="Chicken"
                      image="chicken.svg"
                    />
                    <RadioSelection
                      type="radio"
                      name="menu"
                      value="Pork"
                      image="pig.svg"
                    />
                    <RadioSelection
                      type="radio"
                      name="menu"
                      value="Vege"
                      image="vege.svg"
                    />
                  </MenuGroup>
                  {additionalPerson && (
                    <>
                      <Label htmlFor="companionMenu">
                        {`${t("menu")}${
                          additionalPerson && values.companionName
                            ? " (" + values.companionName + ")"
                            : ""
                        }`}
                      </Label>
                      <MenuGroup id="companionMenu">
                        <RadioSelection
                          type="radio"
                          name="companionMenu"
                          value="Chicken"
                          image="chicken.svg"
                        />
                        <RadioSelection
                          type="radio"
                          name="companionMenu"
                          value="Pork"
                          image="pig.svg"
                        />
                        <RadioSelection
                          type="radio"
                          name="companionMenu"
                          value="Vege"
                          image="vege.svg"
                        />
                      </MenuGroup>
                    </>
                  )}
                  <TextInput
                    label={`${t("dietaryRestrictions")}${
                      additionalPerson && values.name
                        ? " (" + values.name + ")"
                        : ""
                    }`}
                    name="dietaryRestrictions"
                    type="text"
                    placeholder={t("dietaryRestrictionsPlaceholder")}
                  />
                  {additionalPerson && (
                    <TextInput
                      label={`${t(
                        "dietaryRestrictions"
                      )}${values.companionName &&
                        " (" + values.companionName + ")"}`}
                      name="companionDietaryRestrictions"
                      type="text"
                      placeholder={t("dietaryRestrictionsPlaceholder")}
                    />
                  )}
                  <DateSelection label={t("staying")} />
                  <Label htmlFor="airportShuttle">
                    {t("airportShuttleLabel")}
                  </Label>
                  <Checkbox id="airportShuttle" name="shuttle">
                    {t("needShuttle")}
                  </Checkbox>
                  <TextInput
                    label={t("songs")}
                    name="songs"
                    type="text"
                    placeholder={t("songsPlaceholder")}
                  />
                  <TextArea
                    label={t("message")}
                    name="message"
                    rows="5"
                    placeholder={t("messagePlaceholder")}
                  />
                </>
              ) : (
                <>
                  <TextInput
                    label={t("name")}
                    name="name"
                    type="text"
                    placeholder={t("namePlaceholder")}
                  />
                  <TextArea
                    label={t("message")}
                    name="message"
                    rows="5"
                    placeholder={t("messagePlaceholder")}
                  />
                </>
              )}
              <Button type="submit" attending={attending}>
                <span>{isSubmitting ? <LoadingHeart /> : t("submitRsvp")}</span>
              </Button>
            </AnimatedContainer>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default rsvpForm;
