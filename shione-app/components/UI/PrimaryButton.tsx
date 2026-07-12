import { Text, TouchableOpacity } from 'react-native'

type PrimaryButtonProps = {
        title: string;
        onPress: () => void;
        disabled?: boolean
    }




const PrimaryButton = (props: PrimaryButtonProps) => {

     
  return (
   
     <TouchableOpacity
        className="bg-mid rounded-full py-4 items-center mt-2 mb-3"
        onPress={props.onPress}
        disabled={props.disabled}
        style={{
          opacity: props.disabled ? 0.5 : 1,
        }}
    >
        <Text className="text-white text-base font-bold tracking-wide">
           {props.title}
         </Text>
    </TouchableOpacity>
  )
}

export default PrimaryButton
