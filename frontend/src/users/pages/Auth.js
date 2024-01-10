import React, { useState, useContext } from "react";

import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./Auth.css";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );
  const [isLoginMode, setIsLoginMode] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const authCtx = useContext(AuthContext);

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        authCtx.login(responseData.user.id);
      } catch (error) {}
      // try {
      //   const response = await fetch("http://localhost:5000/api/users/login", {
      //     method: "POST",
      //     header: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       email: formState.inputs.email.value,
      //       password: formState.inputs.password.value,
      //     }),
      //   });
      //   const data = response.json();
      //   authCtx.login();
      // } catch (error) {
      //   // setError(error.message || "Something went wrong, please try again.");
      // }
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            username: formState.inputs.username.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        authCtx.login(responseData.user.id);
      } catch (error) {}
      // try {
      //   const response = await fetch("http://localhost:5000/api/users/signup", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       username: formState.inputs.username.value,
      //       email: formState.inputs.email.value,
      //       password: formState.inputs.password.value,
      //     }),
      //   });
      //   const data = await response.json();

      //   if (!response.ok) {
      //     throw new Error(data.message);
      //   }
      //   authCtx.login();
      //   // will not fail if an error code is sent
      // } catch (error) {
      //   // setError(error.message || "Something went wrong, please try again.");
      // }
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      //changing to login mode
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: { value: "", isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    }
    setIsLoginMode((prevState) => {
      return !prevState;
    });
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <>
              <Input
                id="username"
                label="Username"
                element="input"
                onInput={inputHandler}
                type="text"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a username."
              />
              <ImageUpload id="image" center onInput={inputHandler} />
            </>
          )}
          <Input
            id="email"
            label="E-Mail"
            element="input"
            onInput={inputHandler}
            type="email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
          />
          <Input
            id="password"
            label="Password"
            element="input"
            onInput={inputHandler}
            type="password"
            validators={[VALIDATOR_MINLENGTH(7)]}
            errorText="Please enter a valid password (7 character minimum)"
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
