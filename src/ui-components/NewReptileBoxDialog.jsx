/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import React from "react";
import {
  getOverrideProps,
  useDataStoreCreateAction,
} from "@aws-amplify/ui-react/internal";
import { ReptileFeedingBox } from "../models";
import { schema } from "../models/schema";
import {
  Button,
  Flex,
  SelectField,
  Text,
  TextField,
} from "@aws-amplify/ui-react";
export default function NewReptileBoxDialog(props) {
  const {
    reptileFeedingBoxName = "",
    reptileFeedingBoxType,
    overrides,
    ...rest
  } = props;
  const buttonOnClick = useDataStoreCreateAction({
    fields: {},
    model: ReptileFeedingBox,
    schema: schema,
  });
  return (
    <Flex
      gap="24px"
      direction="column"
      width="407px"
      position="relative"
      padding="0px 0px 0px 0px"
      {...rest}
      {...getOverrideProps(overrides, "NewReptileBoxDialog")}
    >
      <Flex
        gap="8px"
        direction="column"
        shrink="0"
        alignSelf="stretch"
        objectFit="cover"
        position="relative"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "Frame 31")}
      >
        <Text
          fontFamily="Inter"
          fontSize="20px"
          fontWeight="700"
          color="rgba(13,26,38,1)"
          lineHeight="25px"
          textAlign="left"
          display="flex"
          direction="column"
          justifyContent="flex-start"
          shrink="0"
          alignSelf="stretch"
          objectFit="cover"
          position="relative"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="New Reptile Feeding Box"
          {...getOverrideProps(overrides, "New Reptile Feeding Box")}
        ></Text>
      </Flex>
      <TextField
        display="flex"
        direction="column"
        justifyContent="center"
        shrink="0"
        alignSelf="stretch"
        objectFit="cover"
        position="relative"
        padding="0px 0px 0px 0px"
        label="Name / Position"
        placeholder="What is your box’s name or where is it?"
        size="large"
        isDisabled={false}
        labelHidden={false}
        variation="default"
        {...getOverrideProps(overrides, "TextField")}
      ></TextField>
      <SelectField
        display="flex"
        direction="column"
        justifyContent="center"
        shrink="0"
        alignSelf="stretch"
        objectFit="cover"
        position="relative"
        padding="0px 0px 0px 0px"
        label="Box Type"
        placeholder="Choose your box type"
        size="large"
        isDisabled={false}
        labelHidden={false}
        variation="default"
        {...getOverrideProps(overrides, "SelectField")}
      ></SelectField>
      <Button
        display="flex"
        gap="0"
        justifyContent="center"
        alignItems="center"
        shrink="0"
        alignSelf="stretch"
        objectFit="cover"
        position="relative"
        size="large"
        isDisabled={false}
        variation="primary"
        children="Create"
        onClick={() => {
          buttonOnClick();
        }}
        {...getOverrideProps(overrides, "Button")}
      ></Button>
    </Flex>
  );
}
