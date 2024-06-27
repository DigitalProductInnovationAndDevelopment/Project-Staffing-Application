const SnackbarOptions = {
    SUCCESS: {
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
        },
        variant: "success",
        autoHideDuration: 3000,
    },
    ERROR: {
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
        },
        variant: "error",
        autoHideDuration: 3000,
    },
    INFO: {
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
        },
        variant: "info"
    }
};

export default SnackbarOptions;
