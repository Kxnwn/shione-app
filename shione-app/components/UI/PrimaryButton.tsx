import { Text, TouchableOpacity } from 'react-native'

type PrimaryButtonProps = {
        title: string;
        onPress: () => void;

    }




const PrimaryButton = (props: PrimaryButtonProps) => {

     
  return (
   
     <TouchableOpacity
        className="bg-mid rounded-full py-4 items-center mt-2"
        onPress={props.onPress}
    >
        <Text className="text-white text-base font-bold tracking-wide">
           {props.title}
         </Text>
    </TouchableOpacity>
  )
}

export default PrimaryButton
