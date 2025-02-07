import PageHeader from "@/components/General/PageHeader"
import { Box, Button } from "@mui/material"
import { MdOutlineDashboardCustomize } from "react-icons/md"
import { RxDashboard } from "react-icons/rx"
import { CiLogin } from "react-icons/ci"
import Link from 'next/link'

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh"
      }}
    >
      <PageHeader routeName="React Template" />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          mt: 2
        }}
      >
        <Link href="/Login" passHref>
          <Button
            variant="outlined"
            sx={{
              mx: 1,
              color: "#1976D2",
              borderColor: "#1976D2",
              '&:hover': {
                backgroundColor: "#1976D2",
                color: "white",
                borderColor: "#1976D2",
                '& .MuiButton-endIcon': {
                  color: "white"
                }
              }
            }}
            endIcon={<CiLogin />}
          >
            Sign In
          </Button>
        </Link>

        <Link href="/Register" passHref>
          <Button
            variant="outlined"
            sx={{
              mx: 1,
              color: "#1976D2",
              borderColor: "#1976D2",
              '&:hover': {
                backgroundColor: "#1976D2",
                color: "white",
                borderColor: "#1976D2",
                '& .MuiButton-endIcon': {
                  color: "white"
                }
              }
            }}
            endIcon={<MdOutlineDashboardCustomize />}
          >
            Register
          </Button>
        </Link>

        <Link href="/Dashboard" passHref>
          <Button
            variant="outlined"
            sx={{
              mx: 1,
              color: "white",
              borderColor: "white",
              backgroundColor: "#1976D2",
              '&:hover': {
                backgroundColor: "white",
                color: "#1976D2",
                borderColor: "#1976D2",
                '& .MuiButton-endIcon': {
                  color: "#1976D2"
                }
              }
            }}
            endIcon={<RxDashboard />}
          >
            Dashboard
          </Button>
        </Link>
      </Box>
    </Box>
  )
}