////// hooks
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

///// map
import { load } from "@2gis/mapgl";

////// fns
import { setInvoiceInfo } from "../../../../store/reducers/mainSlice";
import { getListTA } from "../../../../store/reducers/mainSlice";
import { getAllRouteAgent } from "../../../../store/reducers/mapSlice";

//////icons
// import user from "../../../../assets/images/iAm.jpg";
import user from "../../../../assets/icons/user.svg";

////// style
import "./style.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewAllAgents = () => {
  const dispatch = useDispatch();
  const { invoiceInfo } = useSelector((state) => state.mainSlice);
  const { mapGeo, listRouteAllTA } = useSelector((state) => state.mapSlice);

  const handleClose = () => dispatch(setInvoiceInfo({ guid: "", action: 0 }));

  useEffect(() => {
    let intervalId;
    if (invoiceInfo?.action === 6) {
      dispatch(getListTA({ first: true }));
      const fetchRouteAgent = () => {
        dispatch(getAllRouteAgent());
      };

      fetchRouteAgent();
      intervalId = setInterval(fetchRouteAgent, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [invoiceInfo?.action, dispatch]);

  useEffect(() => {
    if (invoiceInfo?.action === 6) {
      let map;

      // Загружаем карту
      load().then((mapgl) => {
        map = new mapgl.Map("map-container-admin", {
          center: [
            mapGeo?.longitude || 74.5975735,
            mapGeo?.latitude || 42.8508686,
          ],
          zoom: 13,
          key: "4b360754-94b6-4399-9a7b-35811336eb5f",
        });

        // Отображаем маркеры агентов на карте с кастомными иконками
        listRouteAllTA?.forEach((agent) => {
          const { lat, lon, fio } = agent;
          if (lat && lon) {
            new mapgl.Marker(map, {
              coordinates: [lon, lat],
              icon: "https://docs.2gis.com/img/mapgl/marker.svg",
              label: {
                text: fio,
                fontSize: 10,
                offset: [0, 35],
                relativeAnchor: [0.5, 0],
                image: {
                  url: "https://docs.2gis.com/img/mapgl/tooltip-top.svg",
                  size: [100, 50],
                  stretchX: [
                    [10, 40],
                    [60, 90],
                  ],
                  stretchY: [[20, 40]],
                  padding: [15, 10, 5, 10],
                },
              },
            });
          }
        });
      });

      return () => {
        if (map) {
          map.destroy();
        }
      };
    }
  }, [invoiceInfo?.action, listRouteAllTA, mapGeo]);

  return (
    <Dialog
      fullScreen
      open={invoiceInfo?.action == 6}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="viewAllAgents">
        <div className="viewAllAgents__inner">
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Торговые агенты
              </Typography>
              <span>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </span>
            </Toolbar>
          </AppBar>
        </div>

        <div className="viewAllAgents__info">
          <div className="listAgents">
            <TableContainer
              component={Paper}
              sx={{ height: "100%" }}
              className="scroll_table"
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "7%" }}>№</TableCell>
                    <TableCell align="left" style={{ width: "63%" }}>
                      ФИО
                    </TableCell>
                    <TableCell align="left" style={{ width: "30%" }}>
                      Долг
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listRouteAllTA?.map((row, index) => (
                    <TableRow key={row?.product_guid}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "7%" }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell align="left" style={{ width: "63%" }}>
                        {row?.fio}
                      </TableCell>
                      <TableCell align="left" style={{ width: "30%" }}>
                        {row?.duty} сом
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="mapAgents">
            <MapMain />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewAllAgents;

// Компонент для карты
const MapMain = React.memo(
  () => {
    return (
      <div
        id="map-container-admin"
        style={{ width: "100%", height: "100%" }}
      ></div>
    );
  },
  () => true
);
