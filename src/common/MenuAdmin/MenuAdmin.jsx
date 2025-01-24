///// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";

///// components
import { Drawer, List, Collapse } from "@mui/material";
import { ListItem, ListItemIcon } from "@mui/material";
import { ListItemText, Typography } from "@mui/material";

///// icons
import logo from "../../assets/images/rihaLogo.png";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UseIcons from "@mui/icons-material/AccountCircle";

////// helpers
import { listMenu } from "../../helpers/objs";

////// fns

const MenuAdmin = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { dataSave } = useSelector((state) => state.saveDataSlice);

  const [openSections, setOpenSections] = useState({});
  const [activeSubMenu, setActiveSubMenu] = useState({});

  const handleItemClick = ({ path, items, section }) => {
    if (items && items?.length > 0) {
      setOpenSections((prev) => ({ ...prev, [section]: !prev?.[section] }));
      if (!openSections?.[section]) {
        const selectedPath = activeSubMenu?.[section] || items?.[0]?.path;
        navigate(selectedPath);
      }
    } else {
      navigate(path);
    }
  };

  const handleSubItemClick = ({ path }, { section }) => {
    setActiveSubMenu((prev) => ({ ...prev, [section]: path }));
    navigate(path);
  };

  useEffect(() => {
    const expandedSections = {};
    const selectedSubMenus = {};
    listMenu?.forEach((menuItem) => {
      if (
        menuItem?.items?.some((subItem) => subItem.path === pathname) ||
        menuItem?.path === pathname
      ) {
        expandedSections[menuItem?.section] = true;
        const activeSubMenuItem = menuItem?.items?.find(
          (subItem) => subItem?.path === pathname
        );
        if (activeSubMenuItem) {
          selectedSubMenus[menuItem?.section] = activeSubMenuItem.path;
        }
      }
    });
    setOpenSections(expandedSections);
    setActiveSubMenu(selectedSubMenus);
  }, [pathname]);

  const isActive = ({ path }) => pathname === path;

  const logOut = () => {
    navigate("/");
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="menuAdmin">
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{ sx: { width: 280, flexShrink: 0, zIndex: 50 } }}
      >
        <List>
          <ListItem sx={{ padding: 2 }}>
            <img src={logo} alt="Logo" style={{ width: 140, height: 40 }} />
          </ListItem>

          <ListItem sx={{ padding: 2, pt: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <UseIcons />
            </ListItemIcon>
            <Typography variant="body2" color="textSecondary" align="center">
              {dataSave?.fio}
            </Typography>
          </ListItem>

          <ListItem sx={{ pl: 2, pb: 0 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: "11px", fontWeight: 600 }}
            >
              Меню
            </Typography>
          </ListItem>

          {listMenu?.map((menuItem, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                className={`everyItem ${isActive(menuItem) ? "active" : ""}`}
                onClick={() => handleItemClick(menuItem)}
                selected={isActive(menuItem)}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {isActive(menuItem) ? menuItem?.iconActive : menuItem?.icon}
                </ListItemIcon>
                <ListItemText primary={menuItem?.label} />
                {menuItem?.items ? (
                  openSections?.[menuItem?.section] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItem>

              {menuItem?.items && (
                <Collapse
                  in={openSections?.[menuItem?.section]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {menuItem?.items?.map((subItem, subIndex) => (
                      <ListItem
                        button
                        key={subIndex}
                        className={`innerItem ${
                          isActive(subItem) ? "active" : ""
                        }`}
                        onClick={() => handleSubItemClick(subItem, menuItem)}
                        selected={isActive(subItem)}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {isActive(subItem)
                            ? subItem?.iconActive
                            : subItem?.icon}
                        </ListItemIcon>
                        <ListItemText primary={subItem?.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        {/* Выход */}
        <List sx={{ marginTop: "auto" }}>
          <ListItem
            sx={{ padding: 2, justifyContent: "center", cursor: "pointer" }}
            onClick={logOut}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={"Выход"} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default MenuAdmin;
