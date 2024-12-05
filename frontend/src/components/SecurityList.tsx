import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
} from "@mui/material";

interface Security {
    id: number;
    symbol: string;
    securityName: string;
    sector: string;
    country: string;
    trend: number;
}

const SecurityList = () => {
    const [securities, setSecurities] = useState<Security[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/securities")
            .then((response) => response.json())
            .then((data) => setSecurities(data));
    }, []);

    const getTrendColor = (trend: number) => {
        if (trend <= -0.2) return "#f44336";
        if (trend <= 0.2) return "#4caf50";
        return "#2196f3";
    };

    const handleRowClick = (id: number) => {
        navigate(`/securities/${id}`);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography
                variant="h3"
                sx={{
                    textAlign: "center",
                    marginBottom: 4,
                    fontWeight: "bold",
                    color: "#1976d2",
                }}
            >
                Securities
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>
                                Symbol
                            </TableCell>
                            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>
                                Name
                            </TableCell>
                            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>
                                Sector
                            </TableCell>
                            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>
                                Country
                            </TableCell>
                            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>
                                Trend
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {securities.map((security) => (
                            <TableRow
                                key={security.id}
                                hover
                                onClick={() => handleRowClick(security.id)}
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                            >
                                <TableCell align="left">{security.symbol}</TableCell>
                                <TableCell align="left">{security.securityName}</TableCell>
                                <TableCell align="left">{security.sector}</TableCell>
                                <TableCell align="left">{security.country}</TableCell>
                                <TableCell
                                    align="left"
                                    sx={{
                                        backgroundColor: getTrendColor(security.trend),
                                        color: "white",
                                        borderRadius: 1,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {Math.round(security.trend * 100)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SecurityList;
