import { 
    View, 
    StyleSheet, 
    Pressable, 
    Text, 
    SafeAreaView, 
    Platform, 
    StatusBar 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { router } from "expo-router";

interface HeaderProps{
    title: string;
}

export function Header({ title }: HeaderProps){
    return(
        <SafeAreaView style={styles.container}>

            <View style={styles.content}>
                <View style={styles.row}>
                    <Pressable onPress={() => router.back()}>
                        <Feather name="arrow-left" size={30} color="#fff" />
                    </Pressable>

                    <Text style={styles.title}>{title}</Text>
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.azul,
        marginBottom: 10,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 5 : 5,
    },

    content:{
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 15,
    },

    row:{
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: 240
    },

    title:{
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.branco,
    }
})