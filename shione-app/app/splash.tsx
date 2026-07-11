import { View, Text } from 'react-native'
import { MotiView } from 'moti'


export default function SplashScreen() {
    return(
        <View className='flex-1 bg-[#FEFFE1] items-center justify-center'>
            <MotiView
                from={{
                    opacity: 0,
                    translateY: 20
                }}
                animate={{
                    opacity: 1,
                    translateY: 0
                }}
                transition={{
                    type: "spring",
                    duration: 1000
                }}
            >
                 <Text className='text-8xl'>🌸</Text>
            </MotiView>
           
                <MotiView
                    from={{
                        opacity: 0,
                        translateY: 20
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0
                    }}
                    transition={{
                        type: "spring",
                        duration: 1000,
                        delay: 500
                    }}
                >
                    <Text className='text-5xl font-bold text-[#8854C0] mt-4'>Shione</Text>
                </MotiView>

            <MotiView
                from={{
                    opacity: 1
                }}
                animate={{
                        opacity: 1,
                        translateY: 0
                    }}
                    transition={{
                        type: "spring",
                        duration: 1000,
                        delay: 500
                    }}
            >
                <Text className='text-base text-center text-[#8854C0] opacity-70 mt-3 px-10'>Helping you care for your mind, every day.</Text>
            </MotiView>
        </View>
    )
}