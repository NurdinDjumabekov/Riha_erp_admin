///// hooks
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ru from "date-fns/locale/ru";

////// components
import ReactDatePicker from "react-datepicker";
import { BottomSheet } from "react-spring-bottom-sheet";

////// style
import "./style.scss";

////// fns

////// helpers
import { reverseTransformActionDate } from "../../../../helpers/transformDate";
import { transformActionDate } from "../../../../helpers/transformDate";
import { setActiveDateForPhotos } from "../../../../store/reducers/photoSlice";

const ChoiceDateForPhotos = (props) => {
  const { setViewPhotos, setViewDate, viewDate } = props;

  const dispatch = useDispatch();

  const { activeTTForPhoto } = useSelector((state) => state.photoSlice);

  const onChange = (date) => {
    setViewDate(false);
    setViewPhotos(true);
    dispatch(setActiveDateForPhotos(transformActionDate(date))); /// подствляю дату в активгый state
  };

  return (
    <BottomSheet
      open={viewDate}
      onDismiss={() => setViewDate(false)}
      defaultSnap={({ maxHeight }) => maxHeight * 0.7}
      snapPoints={({ maxHeight }) => maxHeight * 0.7}
    >
      <div className="choiceDateForMap__date">
        <ReactDatePicker
          selected={reverseTransformActionDate(activeTTForPhoto)}
          onChange={onChange}
          placeholderText="ДД.ММ.ГГГГ"
          dateFormat="dd.MM.yyyy"
          locale={ru}
          yearDropdownItemNumber={100}
          maxDate={new Date()}
          inline
        />
      </div>
    </BottomSheet>
  );
};

export default ChoiceDateForPhotos;
