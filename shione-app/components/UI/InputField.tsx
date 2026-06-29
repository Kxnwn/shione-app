import { KeyboardTypeOptions, TextInputProps, TouchableOpacity, TextInput } from 'react-native'

type InputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  placeholderTextColor: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean;
}

const InputField = (props: InputFieldProps) => {
  return (
    <TextInput
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            keyboardType={props.keyboardType}
            autoCapitalize={props.autoCapitalize}
            placeholderTextColor={props.placeholderTextColor}
            secureTextEntry={props.secureTextEntry}
            className="bg-cloud border border-soft rounded-2xl px-4 py-4 text-deep text-base"
     />
    

    
  )
}

export default InputField
