﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tarea3.Exceptios
{
    public class NotFoundOperationException : Exception
    {
        public NotFoundOperationException(string message)
            : base(message)
        {

        }
    }
}
