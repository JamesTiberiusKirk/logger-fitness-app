import React from "react";
import { ListRenderItemInfo, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'
import { View, Text } from "../components/Themed";
import { useWorkoutsQuery, WorkoutResponse } from "../state/workouts";
import { RootTabScreenProps } from "../types";
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import Spinner from "react-native-loading-spinner-overlay/lib";
import { Card, Paragraph, Title } from "react-native-paper";
import { useAppSelector } from "../state/state";

function WorkoutsList() {
    const { isLoading } = useWorkoutsQuery()
    const workoutsState = useAppSelector(state => state.workouts)
    console.log(workoutsState);

    const closeRow = (rowMap: any, rowKey: any) => {
        console.log("closing row", rowKey);

        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const onRowDidOpen = (rowKey: any) => {
        console.log('This row opened', rowKey);
    };

    const renderItem = (data: ListRenderItemInfo<WorkoutResponse>, rowMap: RowMap<WorkoutResponse>) => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <Card style={styles.rowFront}>
                <Card.Title title={data.item.workout.title} subtitle={data.item.workout.notes} />
                <Card.Content>
                    <Paragraph>Index:{data.index}</Paragraph>
                    <Paragraph>Key:{data.item.key}</Paragraph>
                    <Paragraph>Start time:{data.item.workout.startTime}</Paragraph>
                    <Paragraph>Exercises: {data.item.exercises?.length}</Paragraph>
                </Card.Content>
            </Card>
        </TouchableHighlight>
    )

    const renderHiddenItem = (data: ListRenderItemInfo<WorkoutResponse>, rowMap: RowMap<WorkoutResponse>) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.list} >
            <SwipeListView
                style={styles.list}
                data={workoutsState.workouts}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                // leftOpenValue={75}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                onRowDidOpen={onRowDidOpen}
            />
            <Spinner
                visible={isLoading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
        </View>

    )

}

export default function WorkoutsScreen({ navigation }: RootTabScreenProps<'Workouts'>) {
    return (
        <View>
            <WorkoutsList />
        </View>
    )

}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    backTextWhite: {
        color: '#FFF',
    },
    list: {
        width: "100%"
    },
    rowFront: {
        width: "100%",
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        borderRadiusTopRight: 10,
        borderRadiusBottomRight: 10,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
})