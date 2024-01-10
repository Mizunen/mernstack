import React, { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (let inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return { inputs: action.inputs, isValid: action.isValid };

    default:
      return state;
  }
};

export const useForm = (initialInputs, initialIsValid) => {
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialIsValid,
  });
  const inputHandler = useCallback((id, value, isValid) => {
    console.log("id is ");
    console.log(id);
    console.log("value is ");
    console.log(value);
    console.log("isValid is ");
    console.log(isValid);
    dispatchFormState({ type: "INPUT_CHANGE", inputId: id, value, isValid });
    console.log(formState);
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatchFormState({
      type: "SET_DATA",
      inputs: inputData,
      isValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
